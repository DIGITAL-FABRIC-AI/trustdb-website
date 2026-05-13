# Scalability & Architecture Pillar — Claim Audit

**Audit date:** 2026-05-13
**Snapshot:** `trustdb:main` (CodeGraph live)
**Methodology:** CodeGraph REST API primary; substrate inventory cross-checked. Every numerical claim resolved to module info / fn body / bench file presence.

---

## Executive Summary

The Scalability & Architecture pillar is the **most uneven** of the audited pillars. Federation, Raft, partitioning, transport-adapter coverage, and the GEMVT causal-token design are **real and demonstrably implemented in code** — and several headline numbers are actually *under*-stated (Raft scoreboard shows 13/4,896/106 vs the actual 16/7,278/117; exchange shows 36 modules / ~264 tests vs the actual **48 modules / 16,838 LOC / 346 tests**).

However, the **Fabric Flight performance hero numbers — `~25% QUIC throughput`, `28% p50 latency reduction`, `zero heap allocs for 1 GB EpistemicBundle`, `80%+ NUMA parallel efficiency`** — are **not backed by any benchmark, test, or even functional implementation** in the repo:

- `exchange::quic_transport` (1,210 LOC, 12 tests) is real protocol code but **does NOT depend on `quinn`** (external deps = `['serde', 'uuid']`). The deep-dive claim "QUIC-native transport (quinn crate)" is contradicted by the dependency graph. No QUIC wire engine is present.
- `storage::io_uring_storage` (191 LOC, **0 tests**) is an **acknowledged stub**: `read_page` returns `Err(PageNotFound)`, `write_page` returns `Err("IoUringStorage not yet implemented")`, and the source comments say "*Phase 5b: This will actually probe the kernel*". The "zero heap allocs for 1 GB EpistemicBundle" claim has no implementation behind it.
- **No NUMA module exists.** `exec::morsel` is 99 LOC / 1 test; `primitives::morsel` is 9 LOC / 0 tests. The "80%+ NUMA parallel efficiency" number is fabricated — there is nothing measuring it.
- `benches::fabric_flight_bench` (206 LOC) exists but its 5 bench fns are: `session_manifest`, `qos_gate`, `power_state`, `watermark`, `session_encoding` — **none** measure QUIC throughput or p50 latency vs gRPC.

For a DoD-facing presentation, **these four numbers must be removed or re-labeled as design targets**, not measured benchmarks. They will not survive a fact-check.

The **5-tier FWGA federation** claim is VERIFIED (`DeviceTier` enum: Mothership / Regional / Desktop / Mobile / EdgeSensor at `device_manifest.rs:82`). The **GEMVT 0.024% false-positive** is mathematically VERIFIED (12-bit `CAUSAL_FP_MASK` in `primitives::causal_token` → 2⁻¹² = 0.0244%). The **3 transport adapters** (BLE/HTTPS/UWB) exist with reasonable test counts. The **11-RPC surface** is VERIFIED (11 `*Request` structs in `exchange::rpc_surface`). The **classification-chain partitioning** is VERIFIED with real routing logic.

**Pillar score recommendation:** Drop overallScore from **8.6 → 7.8** until QUIC/io_uring/NUMA are either implemented and benched, or the claims are explicitly re-labeled "designed, not yet implemented" with no quantitative numbers.

---

## Verdict Table

| # | Claim | Source | Evidence | Verdict | Update |
|---|---|---|---|---|---|
| 1 | **Raft: 13 modules, 4,896 LOC, 106 tests** | `scores.horizontalVertical`, deep-dive narrative | CodeGraph `?filter=replication` → **16 modules, 7,278 LOC, 117 tests** | 🟡 APPROXIMATE (UNDER-stated) | Update to "16 modules, 7,278 LOC, 117 tests" |
| 2 | **FWGA 5-tier DeviceManifest** (Mothership/Regional/Desktop/Mobile/EdgeSensor) | `scores.horizontalVertical`, fwga-federation.json | `store::device_manifest` enum `DeviceTier` line 82, 5 variants confirmed | ✅ VERIFIED | No change |
| 3 | **Classification-chain partitioning: 312 LOC, 5 tests** | deep-dive evidence, scores.json | `store::partition_router` = **335 LOC, 5 tests** (LOC off by 23, tests correct) | 🟡 APPROXIMATE | Update LOC: 312 → 335 |
| 4 | **partition_router has real routing logic** (governance-aware, multi-label, Axiom 3) | deep-dive narrative | `pub fn route()` body confirms classification-chain walk + multi-partition for multi-label entities | ✅ VERIFIED | No change |
| 5 | **build_membership_change() for Raft joint consensus** | deep-dive Raft Membership Changes | No `membership_change` module in CodeGraph; `replication::raft` (432 LOC, 8 tests) contains Raft core but no symbol surfaced for joint-consensus | 🟡 APPROXIMATE (existence not confirmed via surfaced fn list) | Verify via `gh api` or rename to "Raft consensus + ConfigChange entries (8 tests)" |
| 6 | **Device registry 491 LOC, 9 tests** | deep-dive evidence | `store::device_registry` = 491 LOC, 9 tests | ✅ VERIFIED | No change |
| 7 | **Device manifest 304 LOC, 7 tests** | deep-dive evidence | `store::device_manifest` = 304 LOC, 7 tests | ✅ VERIFIED | No change |
| 8 | **Device connection 358 LOC, 6 tests** | deep-dive evidence | `store::device_connection` = 358 LOC, 6 tests | ✅ VERIFIED | No change |
| 9 | **Sync ops 959 LOC** | deep-dive evidence | `store::sync_ops` = **984 LOC, 20 tests** (25 LOC under-stated) | 🟡 APPROXIMATE | Update to 984 LOC, add "20 tests" |
| 10 | **Topology Governor 357 LOC, 8 tests** | deep-dive evidence | `replication::topology_governor` = 357 LOC, 8 tests | ✅ VERIFIED | No change |
| 11 | **State Publisher 330 LOC, 4 tests** | deep-dive evidence | `replication::state_publisher` = 330 LOC, 4 tests | ✅ VERIFIED | No change |
| 12 | **Entry Dedup 732 LOC, 15 tests, 3 strategies** | deep-dive evidence | `replication::entry_dedup` = 732 LOC, 15 tests | ✅ VERIFIED (LOC + tests; "3 strategies" not directly verified via CodeGraph) | No change |
| 13 | **WAF 3.04 (constant across configs)** | scores.dataFootprint, benchmarks.json | Number originates from `Research/TrustDB/tuning-grid-results-2026-03-29.md` (research artifact, not in CodeGraph) | ⚪ EXTERNAL (research artifact) | Keep but cite path explicitly |
| 14 | **Bincode codec 3.3% overhead, JSON 9.2%** | scores.dataFootprint | Number from `Research/TrustDB/trustdb_final_benchmark_report.md` | ⚪ EXTERNAL | Keep; cite path |
| 15 | **Governance 49x cheaper than app-layer (3.3% vs 163%)** | scores.dataFootprint | Same research artifact; no test in CodeGraph re-derives these | ⚪ EXTERNAL | Keep; cite path |
| 16 | **Insert scaling 1.53x for 10x data** | deep-dive elasticity benchmark | Research artifact only; no `tests::insert_scaling*` or `benches::insert_scaling*` in CodeGraph | ⚪ EXTERNAL | Keep; cite path |
| 17 | **Read scaling near-flat 20.2→22.5µs (1x→10x data)** | scores.elasticity, benchmarks.json | Same research artifact; no `benches::read_scaling*` module exists in CodeGraph (only `navier_stokes_twin::scaling_obstruction` and `benches::mera_scaling_bench` which are unrelated) | ⚪ EXTERNAL (research artifact) | Keep but cite path |
| 18 | **5/5 elasticity benchmarks green** | scores.elasticity | All 4 named benchmarks have evidence (online add, online remove, rebalancing, progressive compaction); "5/5" implies a 5th unnamed | 🟡 APPROXIMATE | Either rename to "4/4 dimensions green" or add the 5th |
| 19 | **Progressive compaction module exists** | deep-dive elasticity | `maintenance::progressive_compaction` = **162 LOC, 4 tests** | ✅ VERIFIED | Add "(162 LOC, 4 tests)" specificity |
| 20 | **deregister_device + 22 device tests across 3 modules** | scores.elasticity | device_registry (9) + device_manifest (7) + device_connection (6) = **22 tests across 3 modules** | ✅ VERIFIED | No change |
| 21 | **Fabric Flight: 11-RPC surface** | scores.fabricFlight | `exchange::rpc_surface` exports 11 distinct `*Request` structs: OpenSession, UpdateSession, UpdateSpatialVolume, Traversal, Materialize, PushDeltas, QueryGaps, SubscribeBeliefs, SpatialStream, ExchangeAtoms, Veil | ✅ VERIFIED | No change |
| 22 | **Fabric Flight: 36-module exchange layer, ~264 tests** | scores.fabricFlight, deep-dive | CodeGraph `?filter=exchange` (full pull, not truncated) → **48 modules, 16,838 LOC, 346 tests** | 🟡 APPROXIMATE (UNDER-stated by 12 modules and 82 tests) | **Update to "48-module exchange layer, 16,838 LOC, 346 tests"** |
| 23 | **QUIC-native transport (quinn crate), ~25% throughput improvement vs gRPC** | scores.fabricFlight, deep-dive Section 2.1 | `exchange::quic_transport` external_deps = **`['serde', 'uuid']`** — NO quinn. No `?filter=quinn` match. `benches::fabric_flight_bench` does NOT contain a QUIC-vs-gRPC throughput bench (5 bench fns: session_manifest/qos_gate/power_state/watermark/session_encoding) | ❌ UNVERIFIABLE → 🔴 CONTRADICTED on "quinn crate" sub-claim | **Remove "~25% throughput improvement" or re-label as design target** |
| 24 | **QUIC 28% p50 latency reduction vs gRPC** | scores.fabricFlight, benchmarks.json | Same as #23 — no benchmark file derives the number; no quinn dep | ❌ UNVERIFIABLE | **Remove or re-label as design target** |
| 25 | **io_uring zero-copy: zero heap allocs for 1 GB EpistemicBundle** | scores.fabricFlight, deep-dive Section 2.2 | `storage::io_uring_storage` = 191 LOC, **0 tests**. Bodies: `read_page` returns `Err(PageNotFound)`; `write_page` returns `Err("IoUringStorage not yet implemented")`. Source comments say "Phase 5b: This will actually probe the kernel" | 🔴 CONTRADICTED (stub, not implemented) | **Remove the entire io_uring benchmark line + Section 2.2 narrative or re-label "Designed (Phase 5b), not yet implemented"** |
| 26 | **NUMA-aware morsel-driven 80%+ parallel efficiency** | scores.fabricFlight, deep-dive Section 2.3, benchmarks.json | No NUMA module in CodeGraph. `exec::morsel` = 99 LOC / 1 test; `primitives::morsel` = 9 LOC / 0 tests. No NUMA-pinning code surfaced | ❌ UNVERIFIABLE → 🔴 CONTRADICTED on the 80% number | **Remove "80%+ NUMA parallel efficiency" benchmark; drop the line entirely from Section 2.3** |
| 27 | **GEMVT 0.024% false-positive causal ordering** | scores.fabricFlight, deep-dive Section 2.4, benchmarks.json | `substrate::dynamics::causal_calculus::gemvt_prior` = 280 LOC, 6 tests; `primitives::causal_token::new_causal` uses `fnv1a_12` (FNV-1a truncated to 12 bits via `CAUSAL_FP_MASK`); 2⁻¹² = 0.024414…% mathematically | ✅ VERIFIED (mathematical, not empirical) | Keep; optionally note "12-bit FP space → 2⁻¹² = 0.024% birthday-bound FP rate" |
| 28 | **GEMVT 64-bit token: 12-bit Causal FP + 8-bit Clearance + 36-bit Wall Time + 8-bit counter** | deep-dive Section 2.4, benchmarks.json | 12 + 8 + 36 + 8 = **64 bits**. `extract_causal_fp` confirms 12-bit; `extract_clearance` exists; module is 301 LOC and structurally consistent. Bit allocations are stated in source but not surfaced via CodeGraph; mathematical sum checks out | ✅ VERIFIED (structural + mathematical) | No change |
| 29 | **3 transport adapters: BLE (Watch/AirPods) + HTTPS + UWB (Vision Pro)** | scores.fabricFlight, deep-dive | `exchange::transport_ble` = 394 LOC / 9 tests; `exchange::transport_https` = 442 LOC / 10 tests; `exchange::transport_uwb` = 358 LOC / 9 tests | ✅ VERIFIED (3 modules exist, tested) | No change — note that external_deps = `['serde']` only on all three: these are **protocol adapters / message codecs**, not actual radio/HTTPS drivers. The Watch/AirPods/Vision Pro physical pairings are aspirational labels, not measured |
| 30 | **Hologram Protocol 3-level (L1/L2/L3) progressive depth** | scores.fabricFlight, deep-dive | `exchange::hologram` = 72 LOC, 6 tests; `exchange::progressive_depth` = 373 LOC, 8 tests | ✅ VERIFIED (modules exist; "3 levels" not surfaced via CodeGraph enum dump but structural fit is consistent) | No change |
| 31 | **TCI meta-edge materialization at flush time** | scores.fabricFlight, deep-dive | `exchange::tci_materialization` = 173 LOC, 5 tests | ✅ VERIFIED | No change |
| 32 | **Cross-domain confidence translation (Linear/LogisticRemap/DomainTable)** | scores.fabricFlight | `exchange::confidence_translation` = 292 LOC, 8 tests | ✅ VERIFIED (module exists; 3 strategies not surfaced) | No change |
| 33 | **FWGA 28 sync tests, 6 manifest tests, 3 async worker tests** | deep-dive horizontalVertical narrative | `device_manifest` has 7 tests (claim says 6); sync test count not directly checkable as "28 sync tests" without grep | 🟡 APPROXIMATE | Re-derive or remove specific test count |
| 34 | **Quorum-as-confidence: canonical_confidence_threshold f64 per type (Well 0.67, Property 0.67)** | deep-dive narrative | Not surfaced via CodeGraph filter | ⚪ EXTERNAL (not directly verifiable from CodeGraph) | Leave; cite source PR |
| 35 | **Background SyncWorker: tokio::spawn + 30s periodic fallback** | deep-dive narrative | Not surfaced via CodeGraph | ⚪ EXTERNAL | Leave; cite source PR |
| 36 | **0-RTT connection resumption for known FabricSession instances** | benchmarks.json verdict | No quinn/QUIC dependency means no 0-RTT can actually run; quic_transport.rs is a *protocol/message codec*, not a wire engine | ❌ UNVERIFIABLE | Re-label as design target |

---

## Proposed JSON Corrections

### `scores.json` → `pillars.scalability`

```json
{
  "overallScore": 7.8,      // was 8.6 — pending Fabric Flight implementation evidence

  "metrics": {
    "horizontalVertical": {
      "score": 8.5,
      "summary": "Vertical: single-node B-epsilon tree. Raft consensus: 16 modules, 7,278 LOC, 117 tests. Core + advanced: self-governing topology (WN-RAFT2-04), state publisher (WN-RAFT2-07), entry dedup (WN-RAFT2-02, 3 strategies). Federation: FWGA with 5-tier DeviceManifest (Mothership/Regional/Desktop/Mobile/EdgeSensor), CBAC-enforced sync, quorum-as-confidence. Raft membership changes (joint consensus). Classification-chain partitioning (335 LOC, 5 tests) for governance-aware data locality."
    },
    "dataFootprint": {
      "score": 8.0,
      "summary": "WAF 3.04 (constant across configs, tuning-grid-results-2026-03-29). Bincode codec 3.3% overhead. Governance 49x cheaper than app-layer."
    },
    "elasticity": {
      "score": 9.0,
      "summary": "All 4 dimensions green: online device add (zero-downtime via DeviceManifest), online device remove (deregister_device() + connection graph — 22 device tests across 3 modules: device_registry 9 + device_manifest 7 + device_connection 6), automatic rebalancing (scope-change detection + ScopeChangeDelta triggers sync_with_manifest), progressive compaction (maintenance::progressive_compaction 162 LOC, 4 tests). Read scaling near-flat (20.2-22.5µs for 10x data, per trustdb_final_benchmark_report.md). 4/4 dimensions green."
    },
    "fabricFlight": {
      "score": 7.0,                    // was 9.0 — heavy reduction
      "status": "partial",             // was "excellent"
      "summary": "Fabric Flight v1.0 (2026-04-03): universal epistemic transport protocol. 48-module exchange layer, 16,838 LOC, 346 tests. 11-RPC surface: OpenSession, UpdateSession, UpdateSpatialVolume, Traversal, Materialize, PushDeltas, QueryGaps, SubscribeBeliefs, SpatialStream, ExchangeAtoms, Veil. Hologram protocol (3-level progressive depth, exchange::hologram + exchange::progressive_depth). TCI meta-edge materialization (exchange::tci_materialization, 173 LOC, 5 tests). 3 transport adapter modules: BLE (394 LOC, 9 tests), HTTPS (442 LOC, 10 tests), UWB (358 LOC, 9 tests). Cross-domain confidence translation (exchange::confidence_translation, 292 LOC, 8 tests). GEMVT 64-bit causal token with 12-bit FNV-1a fingerprint → 2⁻¹² = 0.024% mathematical FP rate. DESIGN-PHASE (not yet measured): QUIC native transport, io_uring zero-copy, NUMA morsel-driven execution.",
      "lastUpdated": "2026-05-13"
    }
  }
}
```

### `deep-dives/scalability.json` → `sections[3]` (fabricFlight)

Remove benchmarks **#1 (QUIC vs gRPC throughput)**, **#2 (io_uring Zero-Copy)**, **#3 (NUMA Parallel Efficiency)** as standalone metrics, OR convert them to:

```json
{
  "name": "QUIC Transport Design",
  "value": "Designed — protocol/message codec in exchange::quic_transport (1,210 LOC, 12 tests); quinn-based wire engine not yet integrated",
  "target": "Production",
  "met": false,
  "source": "Spec Section 2.1. exchange::quic_transport external_deps = serde+uuid only; quinn integration pending."
},
{
  "name": "io_uring Zero-Copy Design",
  "value": "Designed (Phase 5b) — storage::io_uring_storage stub (191 LOC, 0 tests); read_page/write_page return 'not yet implemented'",
  "target": "Production",
  "met": false,
  "source": "Spec Section 2.2. Implementation roadmap: probe kernel via io_uring_setup, register buffer pool, wire to NVMe pages."
},
{
  "name": "NUMA Morsel Execution Design",
  "value": "Designed — exec::morsel scaffolding (99 LOC, 1 test); no NUMA pinning module yet",
  "target": "Production",
  "met": false,
  "source": "Spec Section 2.3. No measurement code path; '80%+' is a design target not a measurement."
}
```

### `deep-dives/scalability.json` → evidence list for fabricFlight

```json
"evidence": [
  { "label": "Exchange Module (48 files, 16,838 LOC, 346 tests)", "path": "trustdb/src/exchange/" },
  { "label": "RPC Surface (11 RPCs)", "path": "trustdb/src/exchange/rpc_surface.rs" },
  { "label": "QUIC Transport Codec (1,210 LOC, 12 tests; quinn integration pending)", "path": "trustdb/src/exchange/quic_transport.rs" },
  { "label": "io_uring Storage (Phase 5b stub — 191 LOC, 0 tests)", "path": "trustdb/src/storage/io_uring_storage.rs" },
  { "label": "Hologram Protocol (72 LOC, 6 tests)", "path": "trustdb/src/exchange/hologram.rs" },
  { "label": "Progressive Depth (373 LOC, 8 tests)", "path": "trustdb/src/exchange/progressive_depth.rs" },
  { "label": "TCI Materialization (173 LOC, 5 tests)", "path": "trustdb/src/exchange/tci_materialization.rs" },
  { "label": "Confidence Translation (292 LOC, 8 tests)", "path": "trustdb/src/exchange/confidence_translation.rs" },
  { "label": "Fabric Flight Bench (5 bench fns: session_manifest, qos_gate, power_state, watermark, session_encoding)", "path": "trustdb/benches/fabric_flight_bench.rs" },
  { "label": "GEMVT Prior (280 LOC, 6 tests; 12-bit FNV-1a → 0.024% FP)", "path": "trustdb/src/substrate/dynamics/causal_calculus/gemvt_prior.rs" }
]
```

### `benchmarks.json` → `bySource.fabric-flight`

```json
{
  "source": "Fabric Flight Protocol",
  "benchmarkCount": 4,           // was 7 — only verified-implemented items
  "description": "11-RPC surface, GEMVT causal token, Hologram progressive depth, transport adapters (BLE/HTTPS/UWB)",
  "keyResults": [
    "48-module exchange layer, 16,838 LOC, 346 tests",
    "11 RPCs in exchange::rpc_surface",
    "GEMVT 0.024% FP (12-bit FNV-1a, mathematically verified)",
    "3 transport adapter modules (BLE/HTTPS/UWB) with 28 combined tests"
  ],
  "runCommand": "cargo test -p trustdb (exchange module); cargo bench --bench fabric_flight_bench",
  "resultPath": "trustdb/src/exchange/",
  "note": "QUIC throughput, io_uring zero-copy, and NUMA efficiency are DESIGN targets, not measured benchmarks. Spec: Research/Mesh/Fabric Flight/Fabric Flight — Complete Protocol Specification v1.0.md"
}
```

### `benchmarks.json` → groups[Fabric Flight & Mesh]

Drop the QUIC throughput, QUIC p50, io_uring receive, io_uring send, and NUMA benchmark items. Replace with VERIFIED ones only:

```json
{
  "name": "Fabric Flight & Mesh",
  "icon": "radio",
  "benchmarks": [
    { "name": "Exchange Layer Coverage", "value": "48 modules, 16,838 LOC, 346 tests", "source": "fabric-flight", "pillar": "scalability", "comparisons": [{"system": "Arrow Flight SQL", "value": "Single transport, 6 RPCs"}], "verdict": "Full epistemic transport vocabulary; per-stream classification routing." },
    { "name": "11-RPC Epistemic Surface", "value": "OpenSession, UpdateSession, UpdateSpatialVolume, Traversal, Materialize, PushDeltas, QueryGaps, SubscribeBeliefs, SpatialStream, ExchangeAtoms, Veil", "source": "fabric-flight", "pillar": "scalability", "comparisons": [{"system": "Arrow Flight SQL", "value": "6 RPCs"}, {"system": "gRPC", "value": "Protocol definition only"}], "verdict": "Full protocol lifecycle: session, traversal, materialization, deltas, gaps, belief subscription, spatial, exchange, veil." },
    { "name": "GEMVT Causal Ordering (mathematical)", "value": "12-bit FP → 2⁻¹² = 0.0244% FP rate", "source": "fabric-flight", "pillar": "reliability", "comparisons": [{"system": "Lamport timestamps", "value": "No clearance encoding"}, {"system": "Vector clocks", "value": "O(N) space"}], "verdict": "64-bit token: 12-bit Causal FP (FNV-1a, mathematically bounded FP rate) + 8-bit Clearance + 36-bit Wall Time + 8-bit counter. 6 tests in substrate::dynamics::causal_calculus::gemvt_prior." },
    { "name": "Multi-Transport Adapters", "value": "BLE (394/9), HTTPS (442/10), UWB (358/9) — LOC/tests", "source": "fabric-flight", "pillar": "connectivity", "comparisons": [{"system": "CockroachDB", "value": "TCP only"}], "verdict": "3 transport adapter modules with 28 combined tests. Note: external_deps = serde only on each — these are protocol/message codecs, not radio/HTTPS drivers." },
    { "name": "Hologram Protocol", "value": "L1/L2/L3 progressive depth (exchange::hologram + exchange::progressive_depth)", "source": "fabric-flight", "pillar": "connectivity", "comparisons": [{"system": "GraphQL", "value": "Full server-side resolution"}, {"system": "CloudKit", "value": "Fetch-all-then-filter"}], "verdict": "L1 structural skeleton, L2 + confidence, L3 + provenance + TCI meta-edges. 14 tests combined." },
    { "name": "TCI Meta-Edge Materialization", "value": "Flush-time implicit→explicit synthesis (173 LOC, 5 tests)", "source": "fabric-flight", "pillar": "scalability", "comparisons": [{"system": "Neo4j", "value": "Edges must be explicitly written"}], "verdict": "AtomicU64 co-access counter; B-epsilon flush autonomously synthesizes correlations." }
  ]
}
```

### `benchmarks.json` → `bySources[fabric-flight]` location field

Change `"location": "trustdb/src/exchange/ (36 modules, ~264 tests)"` → `"trustdb/src/exchange/ (48 modules, 346 tests)"`.

---

## Honest Gaps (Section §13 disclosures for the DoD deck)

1. **QUIC transport is not wired to a QUIC engine.** `exchange::quic_transport` (1,210 LOC, 12 tests) is real protocol/message-codec code, but its external_deps are `['serde', 'uuid']` only — there is no `quinn`, no `quiche`, no `s2n-quic` dependency. The "~25% throughput improvement, 28% p50 latency reduction" numbers have no benchmark in the repo (verified: `benches::fabric_flight_bench` contains 5 bench fns, none of which measure QUIC vs gRPC). These are design targets from the Fabric Flight v1.0 spec, not measurements.

2. **io_uring zero-copy is a Phase 5b stub.** `storage::io_uring_storage` is 191 LOC, **0 tests**, and the `read_page` and `write_page` function bodies explicitly return errors ("`IoUringStorage not yet implemented`") with comments stating "Phase 5b: This will actually probe the kernel via io_uring_setup and register the buffer pool." The "zero heap allocs for 1 GB EpistemicBundle" claim is fabricated against this stub — there is no implementation behind it.

3. **NUMA-aware morsel-driven execution does not exist as code.** No NUMA module is registered in CodeGraph (`?filter=numa` returns 0). `exec::morsel` is 99 LOC / 1 test (general morsel scheduler scaffolding), `primitives::morsel` is 9 LOC / 0 tests. The "80%+ parallel efficiency" benchmark has nothing producing the number.

4. **Transport adapters are codecs, not drivers.** `exchange::transport_ble`, `exchange::transport_https`, `exchange::transport_uwb` all have external_deps = `['serde']` only. They contain message-format / protocol-routing logic, but the physical radio (Bluetooth), HTTPS client, and UWB driver are not present. Apple Watch / AirPods / Vision Pro pairings are aspirational labels until the integration crates (e.g., `core-bluetooth`, `reqwest`, NearbyInteraction FFI) are wired in.

5. **`build_membership_change()` for Raft joint consensus is asserted but not surfaced.** The `replication::raft` module exposes 8 tests but CodeGraph does not surface a `build_membership_change` symbol via `?filter=membership_change`. May exist as a non-public helper — needs verification via PR #218 source review.

6. **Several benchmark numbers come from external research artifacts.** WAF 3.04, codec 3.3%, governance 49x cheaper, insert 1.53x, read scaling 20.2→22.5µs all originate from `Research/TrustDB/tuning-grid-results-2026-03-29.md` and `Research/TrustDB/trustdb_final_benchmark_report.md`. These are not in CodeGraph and cannot be independently verified from code; they should be tagged as benchmark-artifact-derived in any DoD deck.

7. **Exchange-layer counts are persistently under-stated.** Scoreboard says "36 modules, ~264 tests"; live CodeGraph snapshot shows **48 modules, 16,838 LOC, 346 tests**. The under-statement is consistent across `scores.json`, `deep-dives/scalability.json`, and `benchmarks.json`. **Update everywhere.**

8. **Raft scoreboard is under-stated.** Scoreboard says "13 modules, 4,896 LOC, 106 tests"; actual is **16 modules, 7,278 LOC, 117 tests**. Update.

9. **"5/5 benchmarks green" in elasticity is a count error.** The deep-dive lists 4 dimensions + read scaling = arguably 5, but the deep-dive only labels 4. Standardize: either 4/4 dimensions or explicitly add the 5th benchmark.

10. **GEMVT 0.024% is mathematical, not empirical.** The 12-bit FP space gives 2⁻¹² ≈ 0.0244% birthday-bound FP rate. This is correct by construction (FNV-1a truncated to 12 bits) but there is **no test that empirically measures the FP rate over a large workload**. The deep-dive should clarify "mathematically bounded" vs "empirically measured".

---

## Summary Recommendation for the DoD Deck

**Keep** (real, verifiable, defensible):
- 5-tier FWGA federation with CBAC-enforced sync
- Raft consensus (16 modules, 7,278 LOC, 117 tests)
- Classification-chain partitioning (governance-aware routing)
- 4-dimension elasticity (zero-downtime add/remove + rebalancing + compaction)
- 48-module exchange layer / 346 tests (CORRECTED upward)
- 11-RPC epistemic surface
- GEMVT mathematical 0.024% FP (CLARIFIED as mathematical)
- 3 transport adapter modules (BLE/HTTPS/UWB codecs)
- Hologram + TCI meta-edges + confidence translation modules

**Remove or relabel as design targets**:
- QUIC native transport "~25% throughput improvement" (no quinn dep, no bench)
- QUIC "28% p50 latency reduction" (no bench)
- io_uring "zero heap allocs for 1 GB EpistemicBundle" (Phase 5b stub, 0 tests)
- NUMA "80%+ parallel efficiency" (no NUMA module exists)
- "Apple Watch / AirPods / Vision Pro" physical pairings (codecs only, no drivers)

**Pillar score**: 8.6 → **7.8** until QUIC/io_uring/NUMA are implemented and benched.

A DoD reviewer running `cargo bench --bench fabric_flight_bench` against this repo will find 5 bench fns, none of which produce the 25% / 28% / zero-allocs / 80% numbers. That is exactly the kind of finding that turns a presentation into a credibility problem. Better to lead with the *real* differentiators (FWGA / Raft / partitioning / elasticity / GEMVT) and clearly mark transport perf as roadmap.
