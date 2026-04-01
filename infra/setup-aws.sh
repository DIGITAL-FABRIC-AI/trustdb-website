#!/bin/bash
set -euo pipefail

# TrustDB Scorecard — One-time AWS infrastructure setup
# Creates S3 bucket + CloudFront distribution with OAC
# Run once, then use deploy.sh for updates
#
# Prerequisites:
#   - AWS CLI configured with account 635298978260
#   - Lambda@Edge function deployed to us-east-1 (see below)

BUCKET="trustdb-scorecard-635298978260"
REGION="ca-central-1"

echo "=== Step 1: Create S3 bucket ==="
aws s3api create-bucket \
  --bucket "${BUCKET}" \
  --region "${REGION}" \
  --create-bucket-configuration LocationConstraint="${REGION}" \
  2>/dev/null || echo "Bucket already exists"

# Block all public access
aws s3api put-public-access-block \
  --bucket "${BUCKET}" \
  --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

echo "=== Step 2: Create CloudFront OAC ==="
OAC_ID=$(aws cloudfront create-origin-access-control \
  --origin-access-control-config \
    Name=trustdb-scorecard-oac,Description="OAC for TrustDB Scorecard",SigningProtocol=sigv4,SigningBehavior=always,OriginAccessControlOriginType=s3 \
  --query 'OriginAccessControl.Id' --output text 2>/dev/null || echo "")

if [ -z "${OAC_ID}" ]; then
  echo "OAC may already exist, looking up..."
  OAC_ID=$(aws cloudfront list-origin-access-controls \
    --query "OriginAccessControlList.Items[?Name=='trustdb-scorecard-oac'].Id | [0]" --output text)
fi
echo "OAC ID: ${OAC_ID}"

echo ""
echo "=== MANUAL STEPS REQUIRED ==="
echo ""
echo "1. Deploy Lambda@Edge to us-east-1:"
echo "   - Create Lambda function 'trustdb-scorecard-auth' in us-east-1"
echo "   - Runtime: Node.js 20.x"
echo "   - Code: infra/lambda-auth/index.js"
echo "   - Publish a version (Lambda@Edge requires versioned ARN)"
echo "   - Add trust policy for edgelambda.amazonaws.com"
echo ""
echo "2. Create CloudFront distribution via console:"
echo "   - Origin: ${BUCKET}.s3.${REGION}.amazonaws.com"
echo "   - Origin access: OAC (${OAC_ID})"
echo "   - Default root object: index.html"
echo "   - Custom error page: 403 -> /index.html (200) for SPA routing"
echo "   - Custom error page: 404 -> /index.html (200) for SPA routing"
echo "   - Viewer request: Lambda@Edge ARN (the versioned one)"
echo "   - Viewer protocol: Redirect HTTP to HTTPS"
echo "   - Cache policy: CachingOptimized"
echo ""
echo "3. Add S3 bucket policy (replace DISTRIBUTION_ARN):"
echo '   {'
echo '     "Statement": [{'
echo '       "Effect": "Allow",'
echo '       "Principal": {"Service": "cloudfront.amazonaws.com"},'
echo '       "Action": "s3:GetObject",'
echo "       \"Resource\": \"arn:aws:s3:::${BUCKET}/*\","
echo '       "Condition": {"StringEquals": {"AWS:SourceArn": "DISTRIBUTION_ARN"}}'
echo '     }]'
echo '   }'
echo ""
echo "4. (Optional) Add custom domain:"
echo "   - Request ACM cert in us-east-1 for scorecard.digital-fabric.com"
echo "   - Add CNAME alternate domain in CloudFront"
echo "   - Add DNS CNAME record pointing to CloudFront domain"
echo ""
echo "=== Setup script complete ==="
