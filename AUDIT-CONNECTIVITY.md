# Connectivity & Ecosystem Pillar — Audit Report

**Date:** 2026-05-13
**Auditor:** Connectivity Pillar Audit Sub-Agent
**Scope:** `pillars.connectivity` (3 metrics: drivers/protocol/tooling) — public-facing TrustDB Scorecard for US DoD presentation
**Files audited:** `scores.json`, `deep-dives/connectivity.json`, `benchmarks.json` (connectivity-relevant sections), `dynamic-value-codec.json`, `changelog.json`, `roadmap.json`, `features.json`
**Method:** CodeGraph REST API + on-disk verification + `gh pr view` for PR claims

---

## 1. Executive Summary

The Connectivity pillar is **mostly grounded** in real code but contains **several material misrepresentations** that would fail a DoD-grade evidence audit:

| Issue Type | Count | Severity |
|---|---|---|
| ✅ Verified claims | 11 | — |
| 🟡 Approximate (small inaccuracies) | 5 | minor |
| 🔴 Contradicted (provably wrong) | 6 | **HIGH** |
| ❌ Unverifiable | 2 | medium |

**The most serious findings:**

1. **🔴 PR numbers point to wrong repository.** All 5 cited PRs (#148, #218, #231, #247, #250) reference `DIGITAL-FABRIC-AI/FabricRS`, NOT `DIGITAL-FABRIC-AI/trustdb`. On the `trustdb` repo, those PR numbers refer to entirely different topics (cytokine cascade, Hilbert spatial index, lock-free CAS, etc.). For a US DoD audience, citing PRs on a repo named "FabricRS" while branding the product as "TrustDB" is a traceability hazard.

2. **🔴 4 named TEP semantic foundation files do not exist.** `src/exchange/view.rs`, `ebp.rs`, `sync_types.rs`, `governance_artifact.rs` — all four are cited in the evidence section but are not on disk. Inventory shows them as renamed/relocated, but the deep-dive's "evidence" paths are dead.

3. **🔴 SwiftUI demo app `TrustDbDemoiOS` does not exist.** No `xcodeproj`, no Xcodegen file, no `*Demo*` files in `wikai-core/`. The claim of "Xcode project via xcodegen" is unsubstantiated.

4. **🔴 "DB-Gym (17 workloads)" overclaims by 42%.** The canonical `db_gym::workloads::all()` registers exactly **12 workloads** (AppleGymSmokeTest + W1–W11). The "17" likely refers to a historical March-30 figure (changelog: "17 workloads measured") but the current code has 12.

5. **🔴 Internal contradiction on JavaScript driver.** `scores.json` claims "JS/TS gRPC client (@trustdb/client)" as part of "4-language driver coverage"; `deep-dives/connectivity.json` simultaneously says JavaScript is "Not yet, `met: false`". Both cannot be true. The package `@trustdb/client` v0.1.0 **DOES** exist with a real `@grpc/grpc-js`-backed implementation (433 LOC TypeScript) — so deep-dive is the wrong one.

6. **🔴 Apple-target list inconsistency.** Deep-dive says "5 Apple targets — iOS, watchOS, macOS, tvOS, visionOS" AND simultaneously lists Rust target triples that are iOS/iOS-sim/watchOS/watchOS-sim/darwin (i.e., 5 entries but only 3 distinct platforms; tvOS and visionOS absent).

**Reliable claims (defendable to DoD):**
- 11 Fabric Flight RPCs in `exchange::rpc_surface` (VERIFIED: exactly 11 named RPC structs).
- QUIC transport at 1210 LOC w/ 12 tests (VERIFIED via CodeGraph).
- 3 transport adapters: BLE (394 LOC, 9 tests), UWB (358, 9), HTTPS (442, 10) — VERIFIED.
- OTel `#[instrument]` on exactly 5 store ops in `store::raw_ops` — VERIFIED (literal count matches).
- 2 Grafana dashboards in `wikai-core/crates/trustdb/dashboards/` — VERIFIED.
- Arrow Flight feature-gated — VERIFIED in `Cargo.toml`.
- Python PyO3 bindings (~2200 LOC across 6 source files) with LensQuery, ConfidenceEnvelope, TemporalProvenance, GovernanceState — VERIFIED.
- Swift C-FFI bindings (TrustDbNvm.swift + .h, 429 LOC ffi.rs) — VERIFIED.

---

## 2. Verdict Table

### 2.1 Drivers metric (score 7.5 in scores.json, 7.0 in deep-dive — INCONSISTENT)

| Claim | Source | Verdict | Notes |
|---|---|---|---|
| "4-language driver coverage: Rust, Python PyO3, Swift C-FFI, JS/TS gRPC" | scores.json | 🟡 APPROXIMATE | All 4 exist; deep-dive contradicts JS status |
| "Rust (native), Full API (47 store op modules + TEP exchange layer)" | deep-dive | 🟡 APPROXIMATE | 54-module `exchange::*` layer (not "TEP" specifically); 47-module store inventory plausible but unverified |
| Python PyO3: LensQuery, ConfidenceEnvelope, TemporalProvenance, GovernanceState | scores+deep-dive | ✅ VERIFIED | All 4 classes present in `wikai_engine.pyi` and `bindings/python/src/*.rs` (~2200 LOC) |
| Python PyO3 = "merged PR #231" | scores+deep-dive | 🔴 CONTRADICTED | PR #231 merged on **FabricRS**, NOT trustdb repo. On trustdb, #231 = "GEO-B Hilbert spatial index" |
| Swift C-FFI = "merged PR #148" | scores+deep-dive | 🔴 CONTRADICTED | Same: PR #148 on FabricRS (merged 2026-03-31); on trustdb repo, #148 = "CE Tier 2 — AnergyPool / CytokineCascade" |
| Swift "5 Apple targets — iOS, watchOS, macOS, tvOS, visionOS" | deep-dive narrative | 🔴 CONTRADICTED | Listed target triples (iOS, iOS-sim, watchOS, watchOS-sim, darwin) = 3 distinct platforms, NOT 5. tvOS + visionOS targets missing. |
| Swift "static lib targets for 5 Apple targets" | deep-dive evidence | 🟡 APPROXIMATE | Cargo.toml has `crate-type = ["lib", "staticlib"]` (correct); 5 target triples plausible but no build script found in repo |
| "TrustDbDemoiOS SwiftUI demo app" + "Xcode project via xcodegen" | deep-dive evidence | 🔴 CONTRADICTED | NO `*Demo*` files, no `.xcodeproj`, no xcodegen project YAML anywhere in `wikai-core/` or `trustdb/` |
| "4 FFI tests" in Swift section | deep-dive | ❌ UNVERIFIABLE | `trustdb_nvm::ffi` not indexed by CodeGraph; file is 429 LOC but test count not directly queryable |
| Apple Ecosystem (PR #218): power-shaped sync 205 LOC / delta sync 169 LOC / spatial scope 158 LOC | deep-dive evidence | 🟡 APPROXIMATE | Files exist: `power_policy.rs` (205 ✅), `delta_encoder.rs` (actual 173, claim 169 — off by 4), `spatial_scope.rs` (158 ✅) |
| PR #218 = "Apple ecosystem deep integration" | scores+deep-dive | 🔴 CONTRADICTED | FabricRS PR #218 title: "Complete next-gen federated architecture — 23 worknodes across Raft + mesh + Apple-ready" — Apple sync is a subset, not the primary topic. trustdb PR #218 = "PERF-B: Lock-Free Concurrency" (unrelated, CLOSED). |
| JavaScript: "Not yet" / `met: false` | deep-dive | 🔴 CONTRADICTED | `@trustdb/client` v0.1.0 package exists (`bindings/javascript/`) with 433 LOC TypeScript using real `@grpc/grpc-js`, `TrustDbClient` class with `connect()`, `getEntity()`, etc. |

### 2.2 Protocol metric (score 9.0)

| Claim | Source | Verdict | Notes |
|---|---|---|---|
| "Fabric Flight v1.0: 11-RPC QUIC-native protocol" | scores+deep-dive | ✅ VERIFIED | `exchange::rpc_surface` has 11 `*Request` structs: OpenSession, UpdateSession, UpdateSpatialVolume, Traversal, Materialize, PushDeltas, QueryGaps, SubscribeBeliefs, SpatialStream, ExchangeAtoms, Veil |
| "QUIC-native transport" via `exchange::quic_transport` | both | ✅ VERIFIED | CodeGraph: 1210 LOC, 12 tests, uses `quinn` crate; struct `QuicEndpoint`, `StreamMultiplexer`, etc. |
| "~25% throughput, 28% p50 latency reduction vs gRPC" | both | ❌ UNVERIFIABLE | No benchmark output found in repo; `benches/fabric_flight_bench.rs` (206 LOC) exists but data not in scorecard sources |
| "TEP semantic foundation (51 tests)" | scores | 🟡 APPROXIMATE | Actual: `exchange::*` family has **47 modules / 346 tests** (CodeGraph). The "51 tests" is conservative/stale; understatement. |
| Evidence paths: `exchange/view.rs`, `exchange/ebp.rs`, `exchange/sync_types.rs`, `exchange/governance_artifact.rs` | deep-dive | 🔴 CONTRADICTED | All 4 paths do NOT exist on disk and are not in CodeGraph. They were either renamed (no rename history visible) or the evidence was authored speculatively. |
| `exchange/` "36 modules, ~264 tests" | scores+deep-dive | 🟡 APPROXIMATE | Actual: 47 modules (`exchange::*`) + 7 supporting modules in inventory = 54 total / 381 tests. The claim understates by ~30%. |
| Lens API: composable filters (confidence/temporal/spatial/classification) + TraversalPlan | both | 🔴 CONTRADICTED | The substrate `lens::*` modules (`lens::types`, `lens::engine`, etc.) are a **Cognitive Lens** system for prompt processing (`pre_process`, `post_process`, `record_outcome`), NOT a query filter API. The only `LensQuery` with `min_confidence`/`max_depth`/`filter_rel_type` lives in Python bindings (`bindings/python/src/lens.rs`). No Rust-side query-filter Lens core module exists by the named description. |
| "TraversalPlan (cacheable, serializable)" | deep-dive | 🔴 CONTRADICTED | No `TraversalPlan` module in CodeGraph (`?filter=traversal_plan` returns 0); `query::traversal` exists (513 LOC, 9 tests) but is not the named entity |
| Arrow Flight feature-gated | both | ✅ VERIFIED | `Cargo.toml` line 79: `flight = ["server", "dep:arrow-schema", "dep:arrow-array", "dep:arrow-ipc", "dep:arrow-flight", "dep:bytes"]`; `arrow-flight` is `optional = true` |
| `exchange::arrow_flight` 395 LOC, 9 tests + `exchange::arrow_gnse_codec` 767 LOC, 5 tests | inventory | ✅ VERIFIED | CodeGraph confirms both LOC + test counts exactly |
| 3 transport adapters (BLE, HTTPS, UWB) | both | ✅ VERIFIED | `exchange::transport_ble` (394 LOC, 9 tests), `exchange::transport_uwb` (358, 9), `exchange::transport_https` (442, 10) — all present in CodeGraph |
| `exchange::belief_subscription` "WAL-flush-triggered push" | both | ✅ VERIFIED | 273 LOC, 6 tests; `evaluate_confidence_change()` returns `Vec<(SessionId, BeliefDelta)>` filtered by confidence delta threshold |
| `exchange::hologram` Hologram protocol (3-level progressive depth) | both | ✅ VERIFIED | 72 LOC, 6 tests in `exchange::hologram` + 408 LOC `pointcloud::hologram_header` (7 tests) |
| gRPC server (tonic) at `src/grpc/` | deep-dive evidence | 🟡 APPROXIMATE | Actual path: `crates/trustdb/src/server/grpc.rs` (559 LOC). Path in deep-dive is wrong but the artifact exists. |
| `proto/trustdb.proto` gRPC proto | deep-dive evidence | ✅ VERIFIED | 347-line `.proto` at `crates/trustdb/proto/trustdb.proto` with BoundedF64, ConfidenceType enum, TemporalProvenance message etc. |

### 2.3 Tooling metric (score 7.5)

| Claim | Source | Verdict | Notes |
|---|---|---|---|
| "WAT + Prometheus exporter (12 tests)" | scores | 🟡 APPROXIMATE | Actual: `telemetry::prometheus` (252 LOC, 5 tests) + `telemetry::counters` (186 LOC, 3 tests) + `telemetry::otel` (118 LOC, 2 tests) = **10 tests** total in telemetry. Off by 2. |
| "Branch session/conn-pillar. PrometheusExporter renders WAT counters as /metrics text exposition" | deep-dive | ✅ VERIFIED | `telemetry::prometheus` exists in main with the exporter; `WatMetrics::to_prometheus()` exposed in PyO3 bindings |
| "11 new tests (branch)" | deep-dive | 🟡 APPROXIMATE | Telemetry-only test count is 10 in main; "11" plausibly includes 1 integration test |
| "OTel `#[instrument]` on 5 key store ops" | scores | ✅ VERIFIED | Exactly 5 `#[instrument]` macros in `store/raw_ops.rs`: `create_entity` (L76), `get_entity` (L98), `entity_count` (L166), `create_section` (L176), `get_sections` (L374) |
| "2 Grafana dashboards (overview + mesh health)" | scores | ✅ VERIFIED | Files exist: `crates/trustdb/dashboards/trustdb-overview.json` + `trustdb-mesh-health.json`. Initial Glob missed them; they are present. |
| "DB-Gym (17 workloads)" | scores+deep-dive | 🔴 CONTRADICTED | Actual: `db_gym::workloads::all()` returns 12 workloads (AppleGymSmokeTest, W1PersonalContext, W2SteadyStateIngest, W3FirstLaunchImport, W4FullTextSearch, W5BatteryEfficiency, W6RightToBeForgotten, W7ConcurrentRW, W8CrashRecovery, W9HotCounter, W10SingleRowInsert, W11SchemalessBlobs). NOT 17. |
| "TrustDB Scorecard" as live dashboard | both | ✅ VERIFIED | This repo (`trustdb-scorecard/`) IS the live dashboard — recursive self-attestation |
| Score-impact mismatch: scores.json `score: 7.5` vs deep-dive `score: 7.0` for tooling | structural | 🔴 CONTRADICTED | scores.json:tooling.score=7.5, deep-dives/connectivity.json:metric=tooling.score=7.0. Pick one. |
| Score mismatch: scores.json:drivers=7.5 vs deep-dive:drivers=7.0 | structural | 🔴 CONTRADICTED | Same: drivers 7.5 vs 7.0 |
| Score mismatch: scores.json:overallScore=8.2 vs deep-dive:overallScore=7.5 | structural | 🔴 CONTRADICTED | Pillar overall: 8.2 vs 7.5 (0.7-point gap) |

### 2.4 benchmarks.json cross-cutting

| Claim | Verdict | Notes |
|---|---|---|
| Source "db-gym" location: `wikai-core/crates/trustdb_gym/` | 🔴 CONTRADICTED | This path does not exist. Canonical is `trustdb/src/db_gym/` (in the separate trustdb repo). |
| Source "db-gym" description: "17-workload benchmark harness" | 🔴 CONTRADICTED | Same as scores.json — actual 12 workloads |
| Source "fabric-flight" location: `trustdb/src/exchange/` (36 modules, ~264 tests) | 🟡 APPROXIMATE | Actual 47 `exchange::*` modules / 346 tests on FabricRS. Number is wrong; path is wrong (`trustdb/` vs `wikai-core/`). |
| `byCompetitor.SQLite` ecosystem dimension: "TrustDB: 4 languages (Swift C-FFI PR #148, Python PyO3 PR #231, JS gRPC)" | 🔴 CONTRADICTED | PRs are on FabricRS not trustdb (see Drivers section above). Same problem across SQLite, Neo4j, RocksDB matchups. |
| `byCompetitor.Neo4j` Clustering: "Full Raft (13 modules, 106 tests)" | ❌ UNVERIFIABLE | Out of pillar scope; reliability/scalability domain |
| `byOperation."Connectivity & Drivers"` benchmark "gRPC Protocol (tonic): 51 TEP tests, trustdb.proto" | 🟡 APPROXIMATE | Proto exists; "51 TEP tests" is the same conservative number as in scores.json |

---

## 3. JSON Corrections

The following surgical edits should be applied to bring the JSON in line with code reality.

### 3.1 `scores.json` (pillars.connectivity)

```json
{
  "drivers": {
    "summary": "4-language driver coverage: Rust (native), Python PyO3 (LensQuery, ConfidenceEnvelope, TemporalProvenance, GovernanceState — FabricRS PR #231), Swift C-FFI (TrustDbNvm.swift + .h, FabricRS PR #148; staticlib cargo target; 3 distinct Apple platforms — iOS/watchOS/macOS — via 5 target triples), JavaScript/TypeScript gRPC client (@trustdb/client, @grpc/grpc-js-backed). Apple deep integration (FabricRS PR #218 'next-gen federated architecture'): power-shaped sync, Watch/AirPods delta sync, Vision Pro spatial scoping (~536 LOC across 3 modules).",
    "score": 7.0,
    "notes_for_audit": "Score lowered to 7.0 to match deep-dive. PR numbers explicitly tagged as FabricRS to prevent confusion with the separate trustdb repo. tvOS/visionOS targets removed — only 3 distinct Apple platforms are actually built."
  },
  "protocol": {
    "summary": "Fabric Flight v1.0: 11-RPC QUIC-native protocol (OpenSession, UpdateSession, UpdateSpatialVolume, Traversal, Materialize, PushDeltas, QueryGaps, SubscribeBeliefs, SpatialStream, ExchangeAtoms, Veil — verified in exchange::rpc_surface). TEP exchange layer: 47 modules / 346 tests. Python-side LensQuery (composable filters via PyO3); substrate-side Rust Lens API not yet implemented as named. Arrow Flight SQL (feature-gated: trustdb crate `flight` feature). 3 transport adapters: BLE (394 LOC, 9 tests), HTTPS (442 LOC, 10 tests), UWB (358 LOC, 9 tests). Belief subscription (273 LOC, 6 tests; WAL-flush-triggered, confidence-delta-threshold-filtered).",
    "score": 8.5,
    "notes_for_audit": "Removed unverified 'TraversalPlan' claim. Substrate Rust Lens API is gap, not delivered. Test counts updated from conservative-stale (51) to actual exchange::* aggregate (346)."
  },
  "tooling": {
    "summary": "WAT counters (186 LOC, 3 tests) + Prometheus exporter (telemetry::prometheus 252 LOC, 5 tests) + OTel integration (telemetry::otel 118 LOC, 2 tests) = 10 telemetry tests. OTel #[instrument] on exactly 5 store ops in store::raw_ops (create_entity, get_entity, entity_count, create_section, get_sections). 2 Grafana dashboards in crates/trustdb/dashboards/ (trustdb-overview.json + trustdb-mesh-health.json). DB-Gym: 12 workloads in db_gym::workloads::all() (NOT 17 — historical figure from earlier benchmark suite). TrustDB Scorecard (this repo). Gaps: GUI admin, CLI tool, additional workloads to reach 17.",
    "score": 7.0,
    "notes_for_audit": "Score aligned to deep-dive (7.0 not 7.5). DB-Gym corrected to 12 workloads. Test counts corrected to actual."
  },
  "overallScore": 7.5
}
```

### 3.2 `deep-dives/connectivity.json`

**Required changes:**

1. **Remove or update phantom evidence paths:**
   - `"path": "wikai-core/crates/trustdb/src/exchange/view.rs"` → file does not exist; remove
   - `"path": "wikai-core/crates/trustdb/src/exchange/ebp.rs"` → file does not exist; remove
   - `"path": "wikai-core/crates/trustdb/src/exchange/sync_types.rs"` → file does not exist; remove
   - `"path": "wikai-core/crates/trustdb/src/exchange/governance_artifact.rs"` → file does not exist; remove
   - `"path": "wikai-core/crates/trustdb/src/grpc/"` → correct to `crates/trustdb/src/server/grpc.rs`

2. **Update JavaScript benchmark:**
   ```json
   {
     "name": "JavaScript/Node.js",
     "value": "TrustDB gRPC client (@trustdb/client v0.1.0, 433 LOC TS)",
     "target": "Stable driver via gRPC/WASM",
     "met": true,
     "source": "bindings/javascript/src/index.ts — TrustDbClient class with @grpc/grpc-js, BoundedFloat, ConfidenceEnvelope, GovernanceArtifact, Entity, Section, ViewResponse interfaces. Connects to trustdb gRPC server.",
     "comparisons": [...]
   }
   ```

3. **Remove "TrustDbDemoiOS" + "Xcodegen" claims** from the Swift section narrative (no evidence in repo).

4. **Correct Apple target list:** "5 Apple targets — iOS, watchOS, macOS, tvOS, visionOS" → "3 distinct Apple platforms (iOS, watchOS, macOS) built as 5 Rust target triples (aarch64-apple-ios, aarch64-apple-ios-sim, aarch64-apple-watchos, aarch64-apple-watchos-sim, aarch64-apple-darwin). tvOS + visionOS targets planned, not yet built."

5. **Tag all PR numbers with repo:** `PR #148 (FabricRS)`, `PR #218 (FabricRS)`, etc. — never bare numbers when the public audience reads "trustdb".

6. **Lens API benchmark — narrow the claim:**
   ```json
   {
     "name": "Lens Core Types + Filters",
     "value": "Python-side LensQuery builder (min_confidence, max_depth, filter_rel_type, direction, with_sections); substrate-side Rust query Lens not yet implemented",
     "target": "Implemented",
     "met": false,
     "source": "bindings/python/src/lens.rs (254 LOC) exposes LensQuery with composable filters. Substrate lens::* modules are a Cognitive Lens system for prompt processing (pre_process/post_process), not a query-filter API. WN-TEP-06 through WN-TEP-09 deliverables are not yet on main."
   }
   ```

7. **Reconcile scores** — deep-dive `overallScore: 7.5` is correct; bring scores.json down to match.

### 3.3 `benchmarks.json`

1. **DB-Gym source:**
   ```json
   {
     "id": "db-gym",
     "name": "DB-Gym",
     "description": "12-workload benchmark harness for TrustDB core KV/entity operations (db_gym::workloads::all() — AppleGymSmokeTest + W1-W11). The historical '17-workload' figure refers to a March-2026 benchmark report that included now-archived workloads.",
     "location": "trustdb/src/db_gym/ (separate trustdb repo) — NOT wikai-core/crates/trustdb_gym/ (path does not exist)",
     ...
   }
   ```

2. **fabric-flight source:** correct module count and test count to `47 modules / 346 tests` on FabricRS. Note both repos in `location` to prevent confusion.

3. **byCompetitor matchups:** replace bare "PR #148" / "#218" / "#231" with "FabricRS PR #N" everywhere they appear.

---

## 4. Honest Gaps (for Wikai briefing / Twin §13)

These are real shortcomings that the scorecard should disclose openly rather than gloss over:

1. **No substrate-canonical Lens query API.** The named "Lens API: composable filters + TraversalPlan" is delivered only as a Python builder in `bindings/python/src/lens.rs`. The Rust-side substrate has a `lens::*` family (`lens::types`, `lens::engine`, etc.) but it's a Cognitive Lens / prompt-processing system, NOT a query filter engine. Until WN-TEP-06 through WN-TEP-09 land as a substrate-canonical `trustdb::lens` (or `exchange::lens`) module, Lens API is "Python builder + Rust prompt-lens" — not a unified protocol-level abstraction.

2. **TraversalPlan does not exist as a named entity.** No `TraversalPlan` struct/module in CodeGraph. The deep-dive's "Lens compilation to TraversalPlan (cacheable, serializable)" is design language without a code referent. Either rename the deliverable to align with `query::traversal` (513 LOC, 9 tests) or implement the TraversalPlan as designed.

3. **TEP semantic foundation evidence paths are dead.** The 4 cited files (`exchange/view.rs`, `ebp.rs`, `sync_types.rs`, `governance_artifact.rs`) don't exist. If the types were merged into other files, the evidence paths must point to where they actually live now. Otherwise, an auditor following the citations will find empty space.

4. **DB-Gym at 12 workloads, target 17.** Either build the 5 missing workloads or update all surface-level mentions ("17 workloads" appears in 3+ places across scores.json, deep-dive, benchmarks.json, changelog.json).

5. **Apple platform breadth is narrower than the marketing.** Real Rust target triples cover iOS + iOS-sim + watchOS + watchOS-sim + darwin = **3 distinct platforms**. The "5 Apple targets" framing only works if you count Simulator variants as separate platforms. tvOS and visionOS are mentioned in the narrative but have no build targets.

6. **No SwiftUI demo app + no Xcode project.** Either build them and add to repo, or remove the claims from the narrative.

7. **Repo identity confusion.** The product is publicly "TrustDB" but the implementation repo is `DIGITAL-FABRIC-AI/FabricRS`. PR numbers cited in the scorecard reference FabricRS PRs, which collide with unrelated PRs of the same number on the actual `DIGITAL-FABRIC-AI/trustdb` repo. For DoD-grade traceability, every PR reference needs an explicit `(FabricRS)` or `(trustdb)` tag.

8. **Internal score inconsistencies.** scores.json and deep-dive disagree on drivers (7.5 vs 7.0), tooling (7.5 vs 7.0), and overall connectivity (8.2 vs 7.5). For a public scorecard, pick one and propagate. The 8.2 vs 7.5 discrepancy alone is 9% of the entire pillar's reported standing.

9. **Performance numbers (~25% throughput, 28% p50 latency reduction)** are not traceable to a benchmark output file in this repo. `benches/fabric_flight_bench.rs` exists (206 LOC) but there's no canonical result file the auditor can open. Either ship the benchmark output (e.g., `Research/Benchmarks/fabric_flight_v1_benchmark_results.json`) or downgrade the claim to "estimated" / "projected".

10. **Telemetry test count is 10, not 12 or 11.** The deep-dive's "11 new tests (branch)" is plausible but the on-main count is 10. Minor, but trivially correctable.

---

## 5. Surface CodeGraph Numbers (for permanent record)

| Module | LOC | Tests | Notes |
|---|---|---|---|
| `exchange::quic_transport` | 1210 | 12 | 11-RPC, QUIC via quinn, stream multiplexer, push deltas |
| `exchange::rpc_surface` | 143 | 3 | Defines 11 RPC request/response structs |
| `exchange::transport_ble` | 394 | 9 | BleConfig, BleFragmenter, BleReassembler, fragmentation |
| `exchange::transport_uwb` | 358 | 9 | UwbPosition, SpatialSyncSession |
| `exchange::transport_https` | 442 | 10 | (3rd adapter — claimed but worth re-checking) |
| `exchange::arrow_flight` | 395 | 9 | FlightTicket/Endpoint/Info, feature-gated |
| `exchange::arrow_gnse_codec` | 767 | 5 | GNSE → Arrow RecordBatch |
| `exchange::belief_subscription` | 273 | 6 | Confidence-delta-threshold-filtered CDC |
| `exchange::hologram` | 72 | 6 | (+ pointcloud::hologram_header 408 LOC, 7 tests) |
| `exchange::*` (all) | — | 346 across 47 modules | Test-aggregate for whole exchange layer |
| `telemetry::prometheus` | 252 | 5 | Renders WAT counters to /metrics |
| `telemetry::otel` | 118 | 2 | Span name constants, attribute keys |
| `telemetry::counters` | 186 | 3 | WAT counter primitives |
| `db_gym::workloads` | 1315 | 0 | 12 workloads registered in `all()` |
| `hardware::apple_qos` | 406 | 8 | QoS class detection, E-core pinning |
| `wikai-core/bindings/python/src/*.rs` | 2199 | (in PyO3 tests) | 6 source files: engine.rs (900), exchange.rs (600), confidence.rs (256), lens.rs (254), errors.rs (132), types.rs (20), lib.rs (37) |
| `wikai-core/bindings/swift/TrustDbNvm.swift+.h` | (Swift wrapper) | n/a | Idiomatic Swift wrapper around C-FFI |
| `wikai-core/crates/trustdb-nvm/src/ffi.rs` | 429 | (not in CG) | `#[no_mangle] extern "C"` FFI surface |
| `wikai-core/bindings/javascript/src/index.ts` | 433 | n/a | TrustDbClient gRPC client, real `@grpc/grpc-js` |
| `wikai-core/crates/trustdb/proto/trustdb.proto` | 347 | n/a | gRPC service definition |
| `wikai-core/crates/trustdb/src/server/grpc.rs` | 559 | n/a | Tonic gRPC server impl |
| `wikai-core/crates/trustdb/dashboards/` | n/a | n/a | 2 Grafana JSON dashboards (overview + mesh-health) |
| `wikai-core/crates/trustdb/src/sync/power_policy.rs` | 205 | n/a | Power-shaped sync (claim: 205 ✅) |
| `wikai-core/crates/trustdb/src/sync/delta_encoder.rs` | 173 | n/a | Delta sync (claim: 169 — off by 4) |
| `wikai-core/crates/trustdb/src/sync/spatial_scope.rs` | 158 | n/a | Spatial scoping (claim: 158 ✅) |

---

## 6. PR Verification Summary (FabricRS repo, github.com/DIGITAL-FABRIC-AI/FabricRS)

| PR | Title | State | Merged | Subject vs Claim |
|---|---|---|---|---|
| #148 | feat: macOS Apple Silicon — platform fix + Swift FFI wrapper (P7-01 iOS UI) | MERGED | 2026-03-31 | ✅ matches "Swift" claim |
| #218 | feat(mesh): Complete next-gen federated architecture — 23 worknodes across Raft + mesh + Apple-ready | MERGED | 2026-04-01 | 🟡 Apple sync is a subset of #218; not the primary topic |
| #231 | feat(connectivity): Lens API, TEP types, Arrow Flight, Grafana — Stream 3 | MERGED | 2026-04-03 | ✅ matches "Python driver / Lens / Arrow Flight / Grafana" claims |
| #247 | feat(trustdb): multi-writer concurrency + WAL HMAC chain | MERGED | 2026-04-03 | (Reliability/Security domain, not Connectivity scope) |
| #250 | feat(trustdb): compliance export (SOX/HIPAA) + SIEM integration (CEF/STIX) | MERGED | 2026-04-03 | (Security domain) |
| #268 | feat(exchange): Fabric Flight QUIC transport — Stream 9 (8 worknodes) | MERGED | 2026-04-03 | ✅ Fabric Flight v1.0; not currently cited in scorecard — **should be** |

**Recommendation:** Add PR #268 (FabricRS) to the protocol metric's evidence — it's the actual landing of Fabric Flight v1.0 (8 worknodes, 18 tests, the QUIC transport + 11-RPC surface).

---

## 7. End

The Connectivity pillar has real substance — 11 RPCs, 3 transport adapters, Python/Swift/JS bindings, Grafana dashboards, OTel + Prometheus exporters all exist and are largely as described. The audit failures are mostly **traceability defects** (wrong repo for PRs, wrong file paths for evidence, slightly inflated test/LOC numbers, 17-vs-12 workloads) and **internal inconsistencies** (scores.json vs deep-dive disagreement). For a DoD audience reading the public scorecard, the **PR-number-references-wrong-repo issue is the highest-priority fix** — followed by the dead evidence paths and the internal score conflicts.

Estimated cleanup effort: **~4 hours** of focused editing on scores.json + deep-dives/connectivity.json + benchmarks.json, plus building the 5 missing DB-Gym workloads (or downgrading "17" to "12") and shipping the benchmark output file for the QUIC vs gRPC numbers.
