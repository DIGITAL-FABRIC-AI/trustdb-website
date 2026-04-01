#!/bin/bash
set -euo pipefail

# TrustDB Scorecard — Deploy to S3 + CloudFront
# Usage: bash infra/deploy.sh

BUCKET="trustdb-scorecard-635298978260"
REGION="ca-central-1"
DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID:-E1B8LOFUJINM9E}"

echo "=== Building ==="
cd "$(dirname "$0")/.."
npm run build

echo "=== Syncing to S3 ==="
aws s3 sync dist/ "s3://${BUCKET}" \
  --delete \
  --region "${REGION}" \
  --cache-control "public, max-age=3600"

# Set long cache for hashed assets
aws s3 sync dist/assets/ "s3://${BUCKET}/assets/" \
  --region "${REGION}" \
  --cache-control "public, max-age=31536000, immutable"

# Set no-cache for index.html (SPA entry point)
aws s3 cp dist/index.html "s3://${BUCKET}/index.html" \
  --region "${REGION}" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html"

echo "=== S3 sync complete ==="

if [ -n "${DISTRIBUTION_ID}" ]; then
  echo "=== Invalidating CloudFront ==="
  aws cloudfront create-invalidation \
    --distribution-id "${DISTRIBUTION_ID}" \
    --paths "/*" \
    --region us-east-1
  echo "=== CloudFront invalidation submitted ==="
else
  echo "=== Skipping CloudFront invalidation (set CLOUDFRONT_DISTRIBUTION_ID to enable) ==="
fi

echo "=== Deploy complete ==="
