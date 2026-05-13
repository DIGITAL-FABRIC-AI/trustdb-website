# Security & Compliance Pillar — Code-Grounded Audit

**Auditor:** Claude (Opus 4.7, 1M-context, CodeGraph-grounded)
**Audit date:** 2026-05-13
**Pillar:** Security & Compliance (3 metrics: Access Control, Encryption, Auditing)
**Audience:** US DoD presentation prep — claims must be defensible against adversarial scrutiny
**Methodology:** CodeGraph REST API (`https://api.digital-fabric.com/codegraph/api/*`) as primary source. Inventory cross-reference at `/tmp/inventory_combined.txt`. Per-claim `info` + `fn/body` queries for high-stakes assertions.

---

## 1. Executive Summary

The Security & Compliance pillar contains the densest substrate code in TrustDB and the highest density of inflated, misattributed, or aspirational claims. Most of the *direction* of the scorecard is correct — TrustDB does have cryptographic access control, per-page governance-bound keys, HMAC-chained WAL audit, and compliance export — but **many of the exact numbers are wrong** in ways that range from generous (single-digit-percent off) to materially misleading (test counts inflated 2-3×, "implemented" claims for design-stage features).

**Headline findings:**

| Claim | Scorecard says | Reality (CodeGraph) | Severity |
|---|---|---|---|
| CBAC tests | 99 unit + 116 (different places) | 141 src + 65 in tests/ = **206** total, or **66** counting only the 3 dedicated test files + integration | 🔴 Two conflicting numbers in same pillar; both wrong |
| RDKC tests | 92 | 95 src + 54 in tests/ = **149** total | 🟡 Understated by ~60 — could be raised |
| REWG tests | 27 | 12 src + 25 in tests/ = **37** total | 🟡 Understated by 10 |
| EACB/FROST tests | 21 "implemented" | 21 src + 29 in tests/ = **50** total — BUT `eacb-frost.json` itself marks status as `"designed"`, and the actual cryptographic backend is `MockVerifier` (no real Schnorr/FROST in code) | 🔴 CONTRADICTED: feature self-marks as designed; no real threshold crypto in repo |
| 352 adversarial gym fns across 28 files | 352 / 28 | **321 tests across 28 security gym files** (excludes 6 non-security gym_apple_*/gym_tkm_* files) | 🟡 Test count overstated by 31 (~10%); 28-file count is correct only when excluding non-security gyms |
| 15,913 security LOC across 14 modules | 15,913 / 14 mods | **25,343 LOC across 94 submodules in 14 namespaces** | 🔴 LOC understated 60%; "modules" should read "namespaces" |
| ML-KEM-1024 + X25519 hybrid PQ transport | "Implemented" / 6 tests | `rdkc::transport` (475 LOC, 5 tests, deps: `ml_kem` + `x25519_dalek`) — **GENUINELY IMPLEMENTED** | ✅ VERIFIED; test count off by 1 |
| FROST threshold signatures | "Implemented" | Trait `ThresholdVerifier` + `MockVerifier` only; zero Schnorr/FROST cryptography in repo (filter=`frost` → 0 modules; filter=`schnorr` → 0 modules) | 🔴 CONTRADICTED — architectural scaffolding only |
| 130 CAM tests | 130 | **134 src + 19 (gym_c03_cnsa2)** = **153** in CAM namespace, or **134** counting src/cam/ only | 🟡 134 is closer to claim than 130; honest reporting is 134 |
| WAL HMAC-SHA384 chain (17 tests) | 17 | `wal::hmac` (9) + `wal::signing` (9) = **18** for HMAC-specific; or `wal::wal` alone = **17** | 🟡 17 misattributes to wrong module; real HMAC tests are 18 |
| 42 ComplianceReport/SIEM tests | 42 | `compliance::export` (8) + `compliance::siem` (11) + `cbac::compliance` (7) = **26** | 🔴 Inflated by 60% |
| 7 control attestations (SOX 404, HIPAA, NIST AU) | 7 explicit | **7 explicit**: NIST AU-10, AU-2, AU-3, AU-12 (4); HIPAA 164.312(b), 164.312(c)(1) (2); SOX 404 (1) | ✅ VERIFIED (verbatim in `build_attestations`) |
| WAF=3.03 zero overhead | 3.03 | Cannot verify from CodeGraph alone — bench result file not in CodeGraph; matches scalability pillar's 3.04. Implied claim "zero I/O from encryption" is qualitative; trust the bench | ⚪ EXTERNAL benchmark — not falsifiable via CodeGraph |
| 2,407 tests passing (encryption metric narrative) | 2,407 | Codebase total = **22,883 test fns**; security pillar src+gym = **870** | 🔴 Number does not match security pillar OR codebase; provenance unknown |
| LDP + ORAM + FHE privacy (39 tests) | 39 | ldp=11 + oram=9 + fhe=19 = **39** | ✅ VERIFIED (exact match) |
| ZK-STARK governance proofs (11 tests) | 11 | `zk::governance_air` (7) + `zk::prover` (4) = **11** — note: `store::zk_scan` (10) + `store::zk_existence` (10) + `consolidation::zk_flush` (11) + `tests::zk_governance_test` (10) add ~41 more in adjacent modules | ✅ VERIFIED for `zk::*` namespace; understated overall |
| TEE/HSM/TPM/PUF (48 tests) | 48 | tee=26 + hsm=7 + tpm=8 + puf=7 = **48** | ✅ VERIFIED (exact match) |
| FIPS 140-3 validation | "Not formally submitted, ACVP vectors built" | `cam::fips_validate` (LOC=397, 7 tests), `cam::fips_boundary` (LOC=511, 12 tests), `cam::fips_graph` (LOC=684, 11 tests), `cam::acvp::*` (4 ACVP modules: aes_gcm_siv, hmac, aes_gcm, hkdf with 4+5+5+3=17 tests) — substantial scaffolding, **not certification** | ✅ VERIFIED (claim is honestly bounded as "not submitted") |
| 168 adversarial tests across 15 gym files | 168 / 15 | 321 / 28 (security only) — see above | 🔴 Both numbers wrong (or refer to a stale snapshot) |
| 116 CBAC tests | 116 | 141 src tests + 65 in tests/ = 206; *or* 141 src + 14 (gym_a03) + 11 (gym_f02) + 20 (gym_g02) = **186** for CBAC-attributable | 🟡 Inflated under 116 figure; deflated under 99-figure — pick one |

**Recommended pillar score adjustment:** Hold overall pillar at **8.4** (currently 8.7); drop Access Control to **7.8** (from 8.0) until FROST is genuinely implemented or correctly labeled "designed"; hold Encryption at **8.5** but re-word LOC/test counts; hold Auditing at **9.3** (from 9.5) after the SIEM/Compliance test-count correction.

---

## 2. Per-Claim Verdict Table

Format: ✅ VERIFIED | 🟡 APPROXIMATE | ❌ UNVERIFIABLE | 🔴 CONTRADICTED | ⚪ EXTERNAL

| # | Claim | Source | Evidence (CodeGraph) | Verdict | Recommended update |
|---|---|---|---|---|---|
| 1 | "CBAC 6-state circuit breaker (99 tests)" | accessControl summary | `src/cbac/` has 19 submodules, 141 src tests, 6,200 LOC. State enum verified in `cbac::state` (336 LOC). 6-state list (Open, Restricted, Sealed, Quarantined, Revoked, Archived) per `cbac.json` differs from deep-dive's (Open, Restricted, Suspended, Quarantined, Sealed, EngagementAuthorized) — internal inconsistency | 🟡 APPROXIMATE | Replace "99 tests" → "141 unit tests + 65 dedicated test-file tests (incl. 14 gym_a03 + 11 gym_f02 + 20 gym_g02 + 20 cbac_rdkc_integration)". Reconcile the two state-name lists across feature.cbac and deep-dive |
| 2 | "REWG graph-derived entitlements (27 tests)" | accessControl summary | `rewg` mod = 12 src tests + 265 LOC. `tests::rewg_test` (10) + `tests::rewg_traverse_test` (15) + `store::rewg_ops` (4) + `store::rewg_prefetch` (6) | 🟡 APPROXIMATE | Replace "27 tests" → "12 + 25 = 37 tests dedicated to REWG, plus 10 in store::rewg_ops/prefetch = 47 total" |
| 3 | "EACB/FROST threshold signatures (21 tests)" | accessControl summary | `eacb::quorum` (7), `eacb::dynamic_threshold` (8), `eacb::evidence` (6), `tests::govgym_eacb_test` (21), `tests::gym_g08_eacb_roe` (8). **CRITICAL:** `eacb::quorum::ThresholdVerifier` trait has only one impl: `MockVerifier`. Zero modules match `?filter=frost` or `?filter=schnorr`. `eacb-frost.json` feature file marks `"status": "designed"`. | 🔴 CONTRADICTED | Either implement FROST (PR with `frost-secp256k1` or `frost-ed25519` crate) OR re-word claim as **"EACB quorum scaffolding (21 tests) — FROST cryptographic backend designed, not implemented; `MockVerifier` in production code"** |
| 4 | "RDKC governance-bound keys (92 tests)" | accessControl summary | `rdkc::*` = 10 submodules, 95 src tests, 4,068 LOC. Plus `tests::rdkc_integration_test` (3), `tests::cbac_rdkc_integration_test` (20), `tests::gym_c02_rdkc_correctness` (31). | 🟡 APPROXIMATE | "92 RDKC tests" → "95 unit tests in src/rdkc/ + 54 in dedicated test files = **149 RDKC tests total**" |
| 5 | "352 adversarial gym functions across 28 files" | accessControl summary, also benchmarks | `?filter=gym` returns 34 `tests::gym_*` files. Filtering out 6 non-security gym files (gym_apple_*, gym_tkm_*) leaves **28 security-pillar gym files with 321 tests, 6,349 LOC**. | 🟡 APPROXIMATE | "352 fns / 28 files" → "**321 adversarial test functions across 28 security gym files**". The 28 is correct; 352 is overstated by 31 (10%) |
| 6 | "15,913 security LOC across 14 modules" | accessControl summary + encryption narrative | Aggregating all 14 named namespaces (rdkc, cam, cbac, eacb, tee, zk, fhe, hsm, tpm, puf, vdf, ldp, oram, wal) yields **25,343 LOC across 94 submodules in 14 namespaces** | 🔴 CONTRADICTED (in TrustDB's favor) | "15,913 LOC / 14 modules" → "**25,343 LOC across 94 submodules in 14 security namespaces**". The current claim underrepresents the codebase by 60% |
| 7 | "AES-256-GCM-SIV per-page encryption" | encryption metric | `rdkc::page_crypto` (262 LOC, 10 tests, deps: `aes_gcm_siv`). `encrypt_page` + `decrypt_page` with page_id + write_counter as additional auth data. PageKey passed as parameter (derived elsewhere by `rdkc::kdf`). | ✅ VERIFIED | Keep as-is. Could specify "10 page_crypto tests" (not "11" as deep-dive claims) |
| 8 | "ML-KEM-1024 + X25519 hybrid PQ transport" | encryption metric | `rdkc::transport` (475 LOC, 5 tests, external deps: **`ml_kem`** + **`x25519_dalek`**). pub structs `MlKemKeyPair`, `X25519KeyPair`, `NodeTransportIdentity`, `EncapsulatedPageKey`. Fns `encapsulate_page_key` / `decapsulate_page_key` per CNSA 2.0 hybrid pattern. **Note `post-quantum-keys.json` feature file marks status as `"designed"` — INTERNAL INCONSISTENCY** | 🟡 APPROXIMATE (impl verified, status flag stale) | "6 transport tests" → "5 transport tests" (matches `rdkc::transport.test_count`). Update `post-quantum-keys.json` `status` from `"designed"` to `"implemented"` |
| 9 | "CNSA 2.0 profiles (130 CAM tests)" | encryption metric | `cam::*` = 22 submodules, **134 src tests**, 6,280 LOC. + `tests::gym_c03_cnsa2_compliance` (19) = 153 total. The narrative paragraph in deep-dive says "130 CAM tests" — slightly understated | 🟡 APPROXIMATE | "130 CAM tests" → "**134 src tests in cam/* (22 submodules, 6,280 LOC) + 19 gym_c03 tests = 153 CNSA 2.0–attributable**" |
| 10 | "TEE/HSM/TPM/PUF hardware trust (48 tests)" | encryption metric | tee=26 + hsm=7 + tpm=8 + puf=7 = **48 src tests**. + `tests::gym_e04_tee_abstraction` (10) = 58 total. | ✅ VERIFIED (matches exactly to 48 if you exclude the gym file) | Keep. Could enrich to "48 src tests + 10 gym_e04_tee_abstraction = 58" |
| 11 | "LDP+ORAM+FHE privacy (39 tests)" | encryption metric | ldp=11 + oram=9 + fhe=19 = **39 src tests**. Note: `ldp::noise` is the only impl module (11 tests, 316 LOC); `oram::path_oram` is the only impl (414 LOC, 9 tests); fhe is mostly `fhe::mock` (287 LOC, 14 tests) — **FHE is mock-only** (no real lattice crypto / no `tfhe-rs` dep) | 🟡 APPROXIMATE (exact count, but FHE is mock-only) | Keep "39 tests", but add disclosure: **"FHE module is currently `fhe::mock`; production FHE backend (tfhe-rs or concrete-cpu) not yet integrated. ORAM is Path-ORAM (414 LOC). LDP is Laplace noise (316 LOC)."** |
| 12 | "ZK-STARK governance proofs (11 tests)" | encryption metric | `zk::*` = 3 modules (44+438+282=764 LOC), 11 src tests (`zk::governance_air` 7 + `zk::prover` 4). Plus `store::zk_scan` (10), `store::zk_existence` (10), `consolidation::zk_flush` (11), `tests::zk_governance_test` (10) = 41 additional ZK-related tests in adjacent modules. **Note: "STARK" not in module names; verify backend choice (winterfell? plonky2? hand-rolled?) externally.** | ✅ VERIFIED for the namespace; ⚪ STARK backend not verifiable from module list | Add: "11 zk/* tests + 41 adjacent zk-related tests in store/* + consolidation/* = 52 ZK-pillar tests". Verify externally whether `zk::prover` is actually STARK or plonk-style; module name `governance_air` (AIR = Algebraic Intermediate Representation, STARK-typical) is consistent with STARK |
| 13 | "WAL HMAC-SHA384 chain (17 tests)" | encryption + auditing | `wal::hmac` (439 LOC, 9 tests, deps: `hmac`+`sha2`+`subtle`). Pub fns confirm chained-HMAC pattern: `compute_chained_hmac`, `verify_chained_hmac`, `encode_chained_record`, `decode_chained_record`, `verify_wal_chain`. WalProvenance struct (agent_id, clearance, connectivity, write_ts_ms). `wal::signing` (270 LOC, 9 tests) = HMAC-related total **18 tests** (not 17). The "17" appears to be `wal::wal` test count, which is the WAL writer, not the HMAC chain. | 🟡 APPROXIMATE | "17 WAL HMAC tests" → "**18 HMAC-specific tests (wal::hmac 9 + wal::signing 9); 17 WAL writer tests in wal::wal**" |
| 14 | "WAF=3.03 zero overhead" + "131% app-layer overhead" | encryption metric | Not verifiable from CodeGraph (benchmark file `Research/Benchmarks/...` not indexed). However the same WAF=3.04/3.03 invariant is cited in Scalability pillar with no encryption — both numbers should be from `db-gym` bench. **The qualitative claim "zero additional I/O from encryption + governance" is the patentable claim per benchmarks.json line 197.** | ⚪ EXTERNAL | No change — bench-anchored. If pressed by DoD reviewers, point to db-gym output file + show `cargo run -p trustdb_gym --release` reproducer |
| 15 | "2,407 tests passing" | encryption summary | Codebase total = **22,883 test fns across 3,365 modules**. Security pillar src+gym = **870** (549 src + 321 gym). The "2,407" number doesn't match anything I can compute from CodeGraph. Could be stale `cargo test` output from a specific filter, but provenance unclear. | ❌ UNVERIFIABLE | **Remove** the "2,407 tests passing" claim or attribute it to a specific dated `cargo test` log. The actual security-pillar test count is **~870** (src + gym, excluding flaky integration tests, ignored tests, and benches) |
| 16 | "168 adversarial tests across 15 gym files" | benchmarks.json security-gym source + benchmarks line 203 | Reality: **321 tests across 28 security gym files** | 🔴 CONTRADICTED (in TrustDB's favor) | Update both `benchmarks.json` source description AND benchmark line 203 to match: 321 / 28 |
| 17 | "116 CBAC tests" | benchmarks line 202 | Conflicts with "99 CBAC tests" in scorecard's accessControl summary AND with reality (141 src + 65 in tests/ = 206) | 🔴 CONTRADICTED (internally and externally) | Pick one number and use it consistently. Recommend: **"141 CBAC unit tests + 65 dedicated test-file tests = 206 total"** |
| 18 | "42 ComplianceReport/SIEM tests" | benchmarks line 201 | `compliance::export` (8) + `compliance::siem` (11) + `cbac::compliance` (7) = **26**. Even with `compliance::*` namespace total (no other tests in `compliance::*` per filter) = 26. | 🔴 CONTRADICTED | "42" → "**26 ComplianceReport + SIEM + CBAC-compliance tests**" |
| 19 | "5-level clearance pruning" | encryption + benchmarks line 198 | `tests::gym_g05_zone_map_pruning` (8 tests, 291 LOC) + `tests::gym_g01_clearance_boundary` (6 tests, 161 LOC). Module `clearance_registry` (governance::atoms + encoding::gnse_schemas) has 5+4=9 tests. | ✅ VERIFIED qualitatively (14 tests demonstrate 5-level pruning) | Keep |
| 20 | "Compliance export — 7 control attestations (SOX 404, HIPAA 164.312(b)/(c)(1), NIST AU-2/3/10/12)" | auditing | `compliance::export::build_attestations` (verified via `fn/body` — see Section 4) contains EXACTLY: NIST AU-10, NIST AU-2, NIST AU-3, NIST AU-12, HIPAA 164.312(b), HIPAA 164.312(c)(1), SOX 404. **7 control attestations, exact match.** | ✅ VERIFIED | Keep as-is. **This is the strongest, most defensible claim in the pillar.** |
| 21 | "SIEM: CEF for ArcSight/Splunk + STIX 2.1 for Sentinel/Elastic, 4 event types" | auditing | `compliance::siem` (494 LOC, 11 tests). Pub fns `format_cef`, `format_stix`, `format_stix_bundle`. Event helper fns: `cbac_transition_event`, `wal_violation_event`, `access_denied_event` = **3 explicit event types** via helpers. `SecurityEventType` enum may carry a 4th — verify externally (likely something like `KeyRotation` or `ComplianceViolation`). | 🟡 APPROXIMATE | "4 event types" → verify enum variants; current visible helpers = 3. Recommend: read `SecurityEventType` enum directly OR change to "3 event-helper functions: cbac_transition / wal_violation / access_denied" |
| 22 | "ProvenanceChain on every entity (zero overhead)" | auditing | `primitives::provenance` (275 LOC, 5 tests), `provenance::chain` (238 LOC, 10 tests), `provenance::edit_op` (187 LOC, 4 tests), `provenance::cabm` (70 LOC, 6 tests). Inline with LeafEntry confirmed by `internal_deps` chain. Zero-overhead is bench-anchored (cf. WAF claim). | ✅ VERIFIED | Keep |
| 23 | "TCI flush-time co-occurrence" | auditing | Not directly searched here; `tci` is referenced as separate module. Pillar deep-dive evidence path `trustdb/src/tci/` is plausible. Defer to Performance/Scalability pillar audits. | ⚪ EXTERNAL | Defer |
| 24 | "ACVP vectors (RFC 4231)" | encryption + auditing | `cam::acvp::acvp_aes_gcm_siv` (232 LOC, 4 tests), `cam::acvp::acvp_hmac` (241 LOC, 5 tests), `cam::acvp::acvp_aes_gcm` (266 LOC, 5 tests), `cam::acvp::acvp_hkdf` (276 LOC, 3 tests). RFC 4231 is HMAC-SHA test vectors — matches `acvp_hmac` (5 tests). | ✅ VERIFIED | Keep. Could enrich: "4 ACVP modules (AES-GCM-SIV, HMAC, AES-GCM, HKDF) with 17 vector tests total" |
| 25 | "FIPS 140-3 validation: not formally submitted" | encryption — honest gap | `cam::fips_validate` (397 LOC, 7 tests), `cam::fips_boundary` (511 LOC, 12 tests), `cam::fips_graph` (684 LOC, 11 tests) — substantial scaffolding indicating the boundary is *being modeled* but not lab-validated. ACVP runner: `cam::acvp::runner` (485 LOC, 3 tests). | ✅ VERIFIED (claim is honestly bounded) | Keep "not formally submitted" wording. Strengthen: "**1,592 LOC + 30 tests across fips_validate/fips_boundary/fips_graph scaffold the FIPS 140-3 module boundary; lab certification is the gap, not engineering**" |
| 26 | "ML-DSA-87 post-quantum signatures (gap)" | accessControl honest-gap | `cam::ml_dsa87_provider` (287 LOC, 9 tests) — **ML-DSA-87 IS implemented**, NOT a gap! External deps include the standard `ml_dsa` crate path | 🔴 CONTRADICTED (in TrustDB's favor) | **Move ML-DSA-87 out of the gap list and into verified.** Update Access Control summary "Gap: ML-DSA-87 post-quantum signatures" → "ML-DSA-87 implemented in cam::ml_dsa87_provider (9 tests). Gap: ML-DSA-87 *signature wiring on WAL HMAC alternative path*" if that is the actual gap |
| 27 | "VDF (11 tests)" | encryption (HSM line) | `vdf::timelock` (347 LOC, 11 tests). Wesolowski-style RSA-group VDF? Not visible from CodeGraph info alone. | ✅ VERIFIED for test count | Keep |
| 28 | "92 RDKC tests, 11 page_crypto tests, 6 transport tests" | accessControl deep-dive | RDKC src = 95 tests (not 92); `rdkc::page_crypto` = 10 (not 11); `rdkc::transport` = 5 (not 6) | 🟡 APPROXIMATE | Update individual numbers: "**95 RDKC unit tests, 10 page_crypto tests, 5 transport tests**" |
| 29 | "Nonce safety: gym_c04 (12 tests)" | encryption nonce-safety bench | `tests::gym_c04_nonce_safety` (170 LOC, **12 tests**) | ✅ VERIFIED | Keep |
| 30 | "Key cache safety: gym_e05 (13 tests)" | encryption key-cache-safety bench | `tests::gym_e05_key_cache_safety` (288 LOC, **13 tests**) | ✅ VERIFIED | Keep |
| 31 | "Background re-encryption: rekey.rs (25 tests)" | encryption rekey bench | `rdkc::rekey` (877 LOC, **25 tests**) | ✅ VERIFIED | Keep |
| 32 | "FHE (19 tests), HSM (7 tests), TPM (8 tests), PUF (7 tests), VDF (11 tests)" | deep-dive evidence list | fhe=19 ✅, hsm=7 ✅, tpm=8 ✅, puf=7 ✅, vdf=11 ✅ — all exact | ✅ VERIFIED | Keep |
| 33 | "TEE (26 tests)" | deep-dive evidence list | tee=26 src ✅ | ✅ VERIFIED | Keep |
| 34 | "20 CBAC-RDKC integration tests" | accessControl narrative | `tests::cbac_rdkc_integration_test` (421 LOC, **20 tests**) | ✅ VERIFIED | Keep |
| 35 | "gym_e01 (12 expiry tests)" | encryption structural-expiry bench | `tests::gym_e01_structural_expiry` (252 LOC, **12 tests**). Also separate `tests::gym_e01_e02_expiry_independence` (244 LOC, **10 tests**). | ✅ VERIFIED (12 tests confirmed) | Keep. Could enrich to "12 + 10 independence tests = 22" |
| 36 | "gym_e02 (10 independence tests)" | encryption per-page-key bench | `tests::gym_e01_e02_expiry_independence` (244 LOC, 10 tests) — appears to combine e01+e02; the "10 independence tests" matches this file | ✅ VERIFIED | Keep |
| 37 | "gym_p01 pre-redaction leakage proof + gym_g01 clearance battery" | accessControl narrative | `tests::gym_p01_pre_redaction_leakage` (215 LOC, 7 tests) + `tests::gym_g01_clearance_boundary` (161 LOC, 6 tests) | ✅ VERIFIED | Keep |
| 38 | "GYM-R01 SSP Evidence Appendix maps 28 gym files to 9 NIST control families" | auditing | `tests::gym_r01_ssp_evidence` (297 LOC, **4 tests**). The "28 files / 9 control families" mapping is internal to the test fixture; verify count externally | 🟡 APPROXIMATE | Spot-check the mapping; only 4 test fns may be insufficient evidence for the 9-family claim |
| 39 | "WAL: 33 WAL tests total" | encryption WAL-tamper-protection bench + auditing WAL bench | All wal::* src = 49 tests + `tests::wal_test` (5) + `storage::aligned_wal` (10) + `store::wal_group_commit` (5) = 69 WAL-attributable. Inner sum (wal::*) = 49. The "33 WAL tests" claim is between these but doesn't match either. | 🟡 APPROXIMATE | "33 WAL tests" → "**49 wal::* tests in 7 src submodules + 5 in tests::wal_test = 54**". If the claim refers to PR #247 specifically, cite the PR commit range and exact added-test count |

---

## 3. Proposed JSON Corrections

### 3.1 `scores.json` — security pillar

```jsonc
"security": {
  "name": "Security & Compliance",
  "subtitle": "The Protection Pillar",
  "icon": "lock",
  "overallScore": 8.4,        // was 8.7 — drop until FROST + ML-KEM wiring + LOC inconsistencies are reconciled
  "metrics": {
    "accessControl": {
      "name": "Access Control",
      "score": 7.8,            // was 8.0 — drop until FROST status is reconciled
      "status": "strong",
      "summary": "CBAC 6-state governance circuit breaker (141 src tests + 65 dedicated test-file tests = 206 CBAC-attributable) + REWG graph-derived entitlements (12 src + 25 dedicated = 37 tests) + EACB quorum scaffolding (21 src + 29 dedicated = 50 tests; cryptographic backend is `MockVerifier` — FROST implementation pending). Cryptographic access control via RDKC governance-bound keys (95 src tests + 54 dedicated = 149 RDKC tests). 321 adversarial test functions across 28 security gym files (6,349 LOC). 25,343 LOC across 14 security namespaces (94 submodules). ML-DSA-87 implemented (cam::ml_dsa87_provider, 9 tests). Gaps: FROST cryptographic backend (Schnorr threshold), FIPS 140-3 lab certification.",
      "lastUpdated": "2026-05-13"
    },
    "encryption": {
      "name": "Encryption",
      "score": 8.5,
      "status": "strong",
      "summary": "AES-256-GCM-SIV per-page encryption (rdkc::page_crypto, 10 tests) with governance-bound keys (RDKC 149 tests total). ML-KEM-1024 + X25519 hybrid PQ transport (rdkc::transport, 5 tests, deps ml_kem + x25519_dalek). CNSA 2.0 profiles (cam, 134 src tests in 22 submodules; 153 with gym_c03). TEE (26) + HSM (7) + TPM (8) + PUF (7) = 48 hardware-trust tests. LDP (11) + ORAM (9) + FHE (19; mock-only — production FHE backend pending) = 39 privacy tests. ZK proofs (zk::governance_air + zk::prover, 11 tests; STARK-typical AIR module name). WAL HMAC-SHA384 chained (wal::hmac + wal::signing, 18 tests). WAF=3.03 invariance (zero governance/encryption I/O overhead). Gaps: FIPS 140-3 lab certification, production FHE backend (currently fhe::mock).",
      "lastUpdated": "2026-05-13"
    },
    "auditing": {
      "name": "Auditing",
      "score": 9.3,            // was 9.5 — drop only because of the SIEM/Compliance test-count contradiction
      "status": "excellent",
      "summary": "ProvenanceChain on every entity (zero overhead). TCI flush-time co-occurrence. CBAC state transition audit (cbac::audit 5 tests + 141 transition tests in cbac::*). WAL HMAC-SHA384 chained (PR #247): [0xCB magic][provenance:26B][record:N][hmac_tag:48B], each tag covers prev_tag + WalProvenance (agent_id, clearance, connectivity, write_ts_ms) for NIST AU-10 non-repudiation. RDKC-derived or static key modes (verified in wal::hmac::WalKeyProvider). ACVP vectors (4 modules: aes_gcm_siv/hmac/aes_gcm/hkdf, 17 tests; HMAC vectors per RFC 4231). Compliance export (compliance::export, 8 tests): ComplianceReport with 7 explicit control attestations — NIST AU-10, AU-2, AU-3, AU-12; HIPAA 164.312(b), 164.312(c)(1); SOX 404. SIEM (compliance::siem, 11 tests): CEF for ArcSight/Splunk + STIX 2.1 for Sentinel/Elastic; 3 event-helper fns (cbac_transition, wal_violation, access_denied). GYM-R01 SSP Evidence (4 tests). 26 ComplianceReport+SIEM+CBAC-compliance tests total.",
      "lastUpdated": "2026-05-13"
    }
  }
}
```

### 3.2 `deep-dives/security.json` — narrative fixes

**Access Control narrative** — replace "99 CBAC unit tests, 92 RDKC tests, 21 EACB tests, 20 CBAC-RDKC integration tests, and 352 adversarial gym test functions across 28 files" with:

> "141 CBAC unit tests in 19 src submodules + 65 in dedicated test files = 206 CBAC-attributable tests. 95 RDKC unit tests in 10 src submodules + 54 in dedicated test files = 149 RDKC-attributable tests. EACB scaffolding: 21 src tests in 5 submodules + 29 in dedicated test files = 50 tests (cryptographic backend is `MockVerifier`; FROST/Schnorr cryptography not yet integrated). 321 adversarial test functions across 28 security gym files (gym_a01..a03, gym_c01..c04, gym_e01..e05, gym_f02, gym_g01..g09, gym_p01..p02, gym_r01, gym_s01..s03, gym_manifest_validation; excluding gym_apple_* and gym_tkm_* which are non-security pillars)."

**Access Control evidence** — fix paths:
- "CBAC Module (99 unit tests)" → "CBAC Module (141 unit tests across 19 submodules)"
- "REWG Module (27 tests)" → "REWG Module (12 src tests; 25 in tests/ — 37 total)"
- "EACB Module (21 tests)" → "EACB Module (21 src tests; 29 in tests/ — 50 total)"
- "RDKC Module (92 tests)" → "RDKC Module (95 src tests in 10 submodules; 149 with dedicated test files)"

**Encryption: FIPS 140-3 benchmark item** — keep `met: false`, strengthen:

```jsonc
{
  "name": "FIPS 140-3 Validation",
  "value": "Not formally submitted — 1,592 LOC + 30 tests across cam::fips_validate/fips_boundary/fips_graph scaffold the boundary; 4 ACVP modules (aes_gcm_siv/hmac/aes_gcm/hkdf, 17 tests) provide RFC-vectored validation. Lab certification is the gap, not engineering.",
  "target": "FIPS 140-3 Level 1",
  "met": false,
  ...
}
```

**Encryption — Post-Quantum Key Transport benchmark** — UPDATE to match implementation:

```jsonc
{
  "name": "Post-Quantum Key Transport",
  "value": "ML-KEM-1024 + X25519 hybrid — 5 transport tests, deps ml_kem + x25519_dalek (CNSA 2.0 aligned)",
  ...
}
```

**Encryption — Hardware Security Modules** — VDF count is correct (11), but the deep-dive says 11; keep.

**Encryption — Privacy Layers** — add disclosure:

```jsonc
{
  "name": "Privacy Layers",
  "value": "LDP Laplace noise (11 tests), ORAM Path-ORAM (9 tests), FHE (19 tests, currently fhe::mock; production backend pending)",
  ...
}
```

### 3.3 `benchmarks.json` — fix security entries

- Line 197 (Encryption WAF): keep
- Line 198 (Zone Map Clearance Pruning): keep (14 tests verify the 5-level pruning)
- Line 199 (Audit Overhead): keep
- Line 200 (WAL HMAC Chain): "33 WAL tests passing" → "**18 HMAC-specific tests (wal::hmac 9 + wal::signing 9); 49 wal::* tests total**"
- Line 201 (ComplianceReport + SIEM): "42 tests passing" → "**26 tests passing (compliance::export 8 + compliance::siem 11 + cbac::compliance 7)**". The 7 control attestations claim is correct.
- Line 202 (CBAC Tests): "116 tests passing" → "**206 tests passing (141 cbac::* src tests + 65 in dedicated test files)**"
- Line 203 (Adversarial Security Tests): "168 tests passing across 15 gym files" → "**321 tests across 28 security gym files**"

- Line 32-39 (`security-gym` source description): "15 gym files" / "168 tests" → "28 gym files" / "321 tests"

### 3.4 Feature file fixes

- **`eacb-frost.json`** — keep `"status": "designed"` (correct) BUT remove from the scorecard's "Implemented" benchmark; only the *quorum scaffolding* is implemented
- **`post-quantum-keys.json`** — change `"status": "designed"` → `"status": "implemented"` (cam::hybrid_provider 15 tests + rdkc::transport 5 tests with ml_kem + x25519_dalek deps prove implementation)

---

## 4. Honest Gaps — Claims Without Code Backing

These claims appear in the scorecard but **are not backed by source code in the current main**. They must be explicitly labeled "aspirational" / "designed" / "planned" or removed before DoD presentation:

| # | Claim | Status | Recommended action |
|---|---|---|---|
| 1 | **FROST threshold signatures** | 🔴 NOT IMPLEMENTED — `eacb::quorum::ThresholdVerifier` trait + `MockVerifier` only; zero modules match `frost` or `schnorr` filter | Add PR for `frost-secp256k1` or `frost-ed25519` crate integration OR re-word all "FROST" mentions to "EACB quorum scaffolding; threshold cryptography pending" |
| 2 | **FHE production backend** | 🟡 MOCK-ONLY — `fhe::mock` (287 LOC, 14 tests) and `fhe::ops` (155 LOC, 0 tests) are stubs; no `tfhe-rs` / `concrete` deps | Disclose "currently fhe::mock; production FHE backend (tfhe-rs or concrete-cpu) integration pending"; do NOT remove the FHE claim (the mock-stage substrate is real) |
| 3 | **FIPS 140-3 formal certification** | 🟡 SCAFFOLDED, NOT CERTIFIED — substantial fips_validate / fips_boundary / fips_graph code (1,592 LOC, 30 tests) but no lab submission | Already correctly disclosed as `met: false` in deep-dive. Keep. |
| 4 | **2,407 tests passing** number | ❌ UNVERIFIABLE — doesn't match security pillar (~870) or codebase total (22,883) | Replace with traceable number anchored to a specific `cargo test` log artifact OR remove |
| 5 | **352 adversarial gym fns** | 🟡 INFLATED — actual is 321 across 28 security gym files | Correct to 321 |
| 6 | **15,913 security LOC across 14 modules** | 🔴 BOTH WRONG — actual is 25,343 LOC across 94 submodules in 14 namespaces | Replace with 25,343 / 94 submodules / 14 namespaces |
| 7 | **42 ComplianceReport/SIEM tests** | 🔴 INFLATED — actual is 26 | Correct to 26 |
| 8 | **168 adversarial tests across 15 gym files** (benchmarks.json line 203 + security-gym source line 32-39) | 🔴 STALE — actual is 321 / 28 | Correct |
| 9 | **116 CBAC tests** (benchmarks.json line 202) vs **99 CBAC tests** (scores.json access control summary) | 🔴 INTERNAL INCONSISTENCY — neither matches reality (141 src tests / 206 with test files) | Reconcile to one number. Recommend 141 (src) or 206 (src + dedicated) |
| 10 | **ML-DSA-87 listed as a "gap"** in access control summary | 🔴 CONTRADICTED — `cam::ml_dsa87_provider` (287 LOC, 9 tests) EXISTS | Move ML-DSA-87 out of the gap list; refine actual gap (e.g., "ML-DSA-87 not yet wired into WAL HMAC alternative path") |

### Honest gaps to ADD (claims that should exist but don't):

- **Side-channel-attested timing**: the scorecard mentions "gym_s01 timing sidechannel" (7 tests) and "gym_s03 timing Welch" (4 tests); these are *adversarial probes*, not certifications. DoD reviewers will press on **what hardware was these run on, and is constant-time backed by `subtle` crate alone or compiler-enforced via `core::hint::black_box`?** Verify in `subtle` external dep usage (visible in cam::cnsa2_provider, wal::hmac).

- **Memory safety beyond Rust's borrow checker**: no claim about `#[no_std]` boundary or about `unsafe` block count. CodeGraph's `unsafe_blocks` field is reported per module. Recommend a transparency claim: "trustdb has X total unsafe blocks across Y modules, audited at PR Z."

- **AES-GCM vs AES-GCM-SIV**: the deep-dive narrative mixes "AES-256-GCM-SIV" with "AES-CTR" comparisons. Both are confirmed in `cam::acvp::acvp_aes_gcm_siv` (4 tests) AND `cam::acvp::acvp_aes_gcm` (5 tests) — TrustDB implements BOTH and tests both with ACVP vectors. This is an *unmentioned strength*.

---

## 5. Cross-References (CodeGraph endpoint hits used)

- `GET /codegraph/api/modules?filter=cbac` — 27 modules
- `GET /codegraph/api/modules?filter=rdkc` — 15 modules
- `GET /codegraph/api/modules?filter=rewg` — 5 modules
- `GET /codegraph/api/modules?filter=eacb` — 7 modules
- `GET /codegraph/api/modules?filter=cam` — 23 modules
- `GET /codegraph/api/modules?filter=wal` — 12 modules
- `GET /codegraph/api/modules?filter=tee` — 8 modules
- `GET /codegraph/api/modules?filter=zk` — 7 modules
- `GET /codegraph/api/modules?filter=fhe` — 4 modules
- `GET /codegraph/api/modules?filter=ldp` — 3 modules
- `GET /codegraph/api/modules?filter=oram` — 3 (+3 landauer_oram) modules
- `GET /codegraph/api/modules?filter=vdf` — 3 modules
- `GET /codegraph/api/modules?filter=hsm` — 3 modules
- `GET /codegraph/api/modules?filter=tpm` — 3 modules
- `GET /codegraph/api/modules?filter=puf` — 3 modules
- `GET /codegraph/api/modules?filter=gym` — 34 gym test modules
- `GET /codegraph/api/modules?filter=frost` — **0 modules**
- `GET /codegraph/api/modules?filter=schnorr` — **0 modules**
- `GET /codegraph/api/modules?filter=ml_kem` — 0 module names (BUT ml_kem appears as external_deps in `rdkc::transport`)
- `GET /codegraph/api/modules?filter=kyber` — **0 modules**
- `GET /codegraph/api/info?module=compliance::export` — 2 pub_fns, 9 pub_structs, 8 tests
- `GET /codegraph/api/fn/body?module=compliance::export&fn=build_report` — verified build flow
- `GET /codegraph/api/fn/body?module=compliance::export&fn=build_attestations` — verified 7 control attestations verbatim
- `GET /codegraph/api/info?module=cam::hybrid_provider` — confirmed Composite SIGNATURE provider (Ed25519 + ML-DSA-87), NOT a hybrid KEM
- `GET /codegraph/api/info?module=cam::cnsa2_provider` — deps `aes_gcm_siv`, `hkdf`, `hmac`, `sha2`, `subtle`, `zeroize` — classical-side CNSA 2.0 primitives
- `GET /codegraph/api/info?module=eacb::quorum` — confirmed `ThresholdVerifier` trait + `MockVerifier` impl
- `GET /codegraph/api/info?module=rdkc::transport` — confirmed ml_kem + x25519_dalek deps; pub fns `encapsulate_page_key` / `decapsulate_page_key`
- `GET /codegraph/api/info?module=rdkc::page_crypto` — confirmed aes_gcm_siv dep; pub fns `encrypt_page` / `decrypt_page`
- `GET /codegraph/api/info?module=wal::hmac` — confirmed `compute_chained_hmac`, `verify_wal_chain`, `WalProvenance` struct
- `GET /codegraph/api/info?module=compliance::siem` — confirmed CEF + STIX + 3 event-helper fns

---

## 6. Bottom Line for DoD Presentation

**What is unambiguously defensible (lead with these):**

1. **7-control compliance attestation generator** — verbatim verifiable from `compliance::export::build_attestations`; the only place in the entire scorecard where claim → code is a 1:1 match (Section 4 of the audit shows the source)
2. **WAL HMAC-SHA384 chained format** — `wal::hmac` pub fns confirm chained-HMAC pattern; WalProvenance struct is exactly per claim
3. **AES-256-GCM-SIV per-page encryption** — `rdkc::page_crypto::encrypt_page` with page_id + write_counter as AAD; standard `aes_gcm_siv` crate
4. **ML-KEM-1024 + X25519 hybrid PQ transport** — `rdkc::transport` confirmed with both deps
5. **ML-DSA-87 post-quantum signatures** — `cam::ml_dsa87_provider` (incorrectly listed as gap in scorecard)
6. **CNSA 2.0 provider** — classical-side primitives (HKDF-SHA384, AES-256-GCM-SIV, HMAC) wired with ACVP vectors

**What needs to be re-worded before DoD review (avoid these as-stated):**

1. "FROST threshold signatures (21 tests)" — say "EACB quorum scaffolding; FROST cryptographic backend designed, not implemented"
2. "FHE privacy layer" — say "FHE mock substrate (19 tests); production FHE backend (tfhe-rs) integration pending"
3. "2,407 tests passing" — attribute to specific `cargo test` snapshot or replace with verifiable per-pillar counts (security = ~870; codebase = 22,883)
4. "15,913 security LOC across 14 modules" — say "25,343 LOC across 94 submodules in 14 security namespaces"
5. "352 adversarial gym fns across 28 files" — say "321 adversarial test functions across 28 security gym files"
6. "168 adversarial tests across 15 gym files" — same correction (this is the older snapshot)
7. "116 CBAC tests" — say "206 (141 src + 65 in dedicated test files)" OR "141 src tests"
8. "42 ComplianceReport/SIEM tests" — say "26"
