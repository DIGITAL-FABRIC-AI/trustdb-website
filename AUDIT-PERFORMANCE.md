# Performance Pillar Audit — TrustDB Scorecard

**Audit date:** 2026-05-13
**Scope:** `scores.json` → `pillars.performance` + `deep-dives/performance.json` + `benchmarks.json` (pillar=performance) + 8 feature files.
**Method:** CodeGraph (`https://api.digital-fabric.com/codegraph/api/*`) for code/LOC/test verification; on-disk benchmark files at `D:/Digital Fabric/Research/TrustDB/benchmark-results-*.md` for measured numbers; inventory at `/tmp/inventory_combined.txt`.

---

## 1. Executive Summary

**Accuracy:** ~31% verified (16 of 51 distinct numeric/code claims). 11 contradicted by code or measurement, 17 unverifiable (no source file or method doc), 7 approximate / external comparators.

**Top 3 issues (DoD-blockers):**

1. **PR #247 multi-writer concurrency stack is shelf-ware.** `concurrency::conflict_graph` (fan_in=0), `concurrency::epoch_guard` (fan_in=0), `concurrency::epoch_table` (no consumer beyond epoch_guard), `tx::partitioned_tx` (fan_in=0) — none are wired into the live store. The entire "8.0 concurrency, multi-writer MVCC, 27 tests" claim is built on isolated modules with no production fan-in. The scorecard presents this as a live capability.

2. **Headline throughput numbers are not measured — they are inverse-of-latency arithmetic.** `52,100 ops/s` ≈ 1/19.2µs. `45,200 ops/s` ≈ 1/22.1µs. No benchmark file contains these numbers as measured points. The actual measured **52,100 / 45,200 / 47,600 / 106,400 / 1,095 / 8,616** are partially fabricated: 8,616 (FileIo) is real (tuning-grid file); the rest do not appear in any source benchmark.

3. **Batch Write 100, Range Scan 1K, Cross-Modal 182µs, Edge Create 47,600/s, CWBM25 1,095 qps, jurisdiction 1.63µs, 5.8M× projection — none can be traced to a source file.** Actual measured `batch_write/100 = 1.800ms` (claim 940µs is **52% lower than measured** = misrepresented as 2× faster). Actual `range_scan_1k = 524.54µs` (claim 469µs, 12% lower). Actual `CW-BM25 (1K) = 775µs` per query (claim "1,095 qps" not derivable). 5.8M× projection traces to `Research/Data Interchange/API/TrustDB — Epistemic Data Architecture...` which **explicitly states the projection "must not be presented as a measured result"** — scorecard violates the source's own caveat.

**Recommendation:** Do NOT present the Performance pillar to DoD as-is. (a) Drop or label "projected" everything beyond the 5 numbers actually in `benchmark-results-v2-2026-03-28.md`. (b) Drop the 8.0 concurrency claim until ConflictGraph / EpochGuard / PartitionedTx have a non-zero fan-in into the store. (c) Replace `cwbm25.rs`, `geohash3d.rs`, `adaptive_epsilon.rs`, `gemvt.rs`, `jurisdiction.rs`, `edge_types.rs (11 canonical)`, `write_coalescer`, `CentralHashBuffer` file paths with real ones — most cited paths do not exist.

---

## 2. Verdict Table

### 2.1 Latency claims (`metrics.latency` + deep-dive)

| # | Claim | Source | Evidence | Verdict | Recommended update |
|---|---|---|---|---|---|
| L1 | "Point write 19.2µs" | scores+deep-dive | `benchmark-results-v2-2026-03-28.md` shows **point_write = 19.4µs** (low 19.118 / high 19.624). | 🟡 APPROXIMATE | Use 19.4µs (median) |
| L2 | "Point read 22.1µs" | scores+deep-dive | `benchmark-results-v2` shows `point_read (1K pool) = 21.57µs`. Claim is upper-end of the interval. | 🟡 APPROXIMATE | Use 21.6µs |
| L3 | "Batch Write 100: 940µs" | deep-dive | `benchmark-results-v2`: **`batch_write/100 = 1.800ms`** (low 1.760 / high 1.845). Claim is **52% below measured** — implies 2× faster than reality. | 🔴 CONTRADICTED | Update to 1.80ms (106K ops/s claim becomes 55.6K) |
| L4 | "Range Scan 1K keys: 469µs" | deep-dive | `benchmark-results-v2`: `range_scan_1k = 524.54µs`. Claim is 12% lower. | 🟡 APPROXIMATE | Update to 524µs |
| L5 | "Cross-Modal Full Onboarding 182µs" | scores+deep-dive | **No benchmark file contains "182" or "onboarding" or "full_well"**. Cited evidence path `Research/TrustDB/trustdb_final_benchmark_report.md` does not exist. | ❌ UNVERIFIABLE | Delete claim OR cite the measurement script |
| L6 | "TDQP Decay Eval 6.67ns" | deep-dive | `benchmark-results-v2`: `tdqp_decay_eval = 6.044ns`. | 🟡 APPROXIMATE | Update to 6.04ns |
| L7 | "RRMS Reinforced Decay 10.3ns" | deep-dive | `benchmark-results-v2`: `rrms_reinforced_decay = 12.095ns`. Claim is **15% lower than measured**. | 🔴 CONTRADICTED | Update to 12.1ns |
| L8 | "scan-hot mode 41x range scan improvement (69µs vs 2,825µs)" | scores | No benchmark file contains 69µs / 2825µs / 41x. `tree::aet` only exposes `compute_epsilon_at_split`, `maybe_halve_counters` — no scan-hot mode toggle. | ❌ UNVERIFIABLE | Delete OR cite tuning-grid run |
| L9 | "NVM Tier 1 write ~50ns (dc cvap to DRAM)" | scores | Industry-standard ARM64 cache-line flush latency. `storage::nvm_io` exists (296 LOC, 8 tests) but no measurement. | ⚪ EXTERNAL | Note as "hardware spec, not measured in TrustDB" |
| L10 | "Software prefetch overlaps ~100ns cache miss" | scores | No benchmark; theoretical CPU spec. | ⚪ EXTERNAL | Note as cache-line spec |

### 2.2 Throughput claims (`metrics.throughput` + deep-dive)

| # | Claim | Source | Evidence | Verdict | Recommended update |
|---|---|---|---|---|---|
| T1 | "52,100 write ops/s (SimulatedIo)" | scores+deep-dive | Not in any benchmark file. Equals 1/19.2µs = 52,083 — inverse of latency, not measured throughput. | 🔴 CONTRADICTED | Mark as derived (1/latency), not measured; 1/19.4µs = 51,546 ops/s |
| T2 | "45,200 read ops/s" | scores+deep-dive | Not in any benchmark file. ≈ 1/22.1µs. | 🔴 CONTRADICTED | Mark as 1/latency derived; 46.3K |
| T3 | "Batch Write 106,400 ops/s" | scores+deep-dive | Derived from 940µs/100 — but actual batch_write/100 = 1.800ms → **55,555 ops/s**. | 🔴 CONTRADICTED | Update to 55.6K ops/s |
| T4 | "Batch coalesced 193,000 ops/s (90% coalesce ratio)" | scores | **No `write_coalescer` module exists in CodeGraph.** `CentralHashBuffer` does not exist. Only an unrelated `tests::kmeans_coalescer_production_integration` test. | ❌ UNVERIFIABLE | Delete claim (no implementation) |
| T5 | "CWBM25 Search 1,095 qps (1K sections)" | deep-dive | `benchmark-results-v2`: `CW-BM25 search (1K sections) = 775µs/query`. 1/775µs = 1,290 qps. Claim is 15% LOW vs derivation. Note: actual module `search::bm25` has **0 tests**, fan_in=3 (wired into search::engine). | 🟡 APPROXIMATE | Update to 1,290 qps OR cite the actual µs/query |
| T6 | "Edge Create 47,600 edges/s" | deep-dive | **No benchmark file contains 47,600 or "edge create" with this number.** No multimodal results file exists. | ❌ UNVERIFIABLE | Delete OR provide measurement source |
| T7 | "FileIo 8,616 ops/s" | scores+deep-dive | `tuning-grid-results-2026-03-29.md`: "**flush_threshold=8192, epsilon=0.8** → 8,616 ops/s". | ✅ VERIFIED | Keep |
| T8 | "Per-thread write coalescer 8-10x fewer CAS / 90% coalesce" | scores+deep-dive | No `write_coalescer` module. Numbers fabricated. | ❌ UNVERIFIABLE | Delete |
| T9 | "NVM CentralHashBuffer wait-free via AtomicU64 fetch_add" | scores | No `central_hash` or `CentralHashBuffer` module in CodeGraph. | ❌ UNVERIFIABLE | Delete |

### 2.3 Concurrency claims (`metrics.concurrency` + deep-dive)

| # | Claim | Source | Evidence | Verdict | Recommended update |
|---|---|---|---|---|---|
| C1 | "Multi-writer MVCC via 64-stripe partitioned locks (PR #247)" | scores+deep-dive | `tx::partitioned_lock` exists (209 LOC, 5 tests). FNV-1a hash on first 9 bytes ✅. But stripe count is **configurable** (default not 64 — `with_partitions` rounds to next pow2). **fan_in=1** (only `tx::partitioned_tx` consumes it). | 🟡 APPROXIMATE | Specify "configurable stripes, recommended 64; current consumers: 1 (partitioned_tx)" |
| C2 | "PartitionedTx (339 LOC)" | deep-dive evidence | `tx::partitioned_tx` = 339 LOC ✅, 6 tests. **fan_in=0** — not wired into the store. | 🔴 CONTRADICTED (shelf-ware) | Mark as "experimental; not wired into production store path" |
| C3 | "ConflictGraph (429 LOC)" | deep-dive evidence | `concurrency::conflict_graph` = **431 LOC** (close), 5 tests ✅. **fan_in=0** — zero consumers. Pure shelf-ware. | 🔴 CONTRADICTED (shelf-ware) | Drop claim OR mark "isolated module, not wired into store" |
| C4 | "EpochGuard (212 LOC)" | deep-dive evidence | `concurrency::epoch_guard` = 212 LOC ✅, 5 tests ✅. **fan_in=0** — shelf-ware. | 🔴 CONTRADICTED (shelf-ware) | Drop OR mark unwired |
| C5 | "EpochTable (127 LOC)" | deep-dive evidence | `concurrency::epoch_table` = 127 LOC ✅, 3 tests ✅. | ✅ VERIFIED LOC | Verify fan_in before claiming live |
| C6 | "Cooccurrence (192 LOC)" | deep-dive evidence | `concurrency::cooccurrence` = 192 LOC ✅, 3 tests ✅. | ✅ VERIFIED | — |
| C7 | "27 tests across concurrency/tx modules" | scores+deep-dive | conflict_graph 5 + epoch_guard 5 + epoch_table 3 + cooccurrence 3 + partitioned_lock 5 + partitioned_tx 6 = **27** ✅ | ✅ VERIFIED | Keep |
| C8 | "Deadlock-free via sorted lock ordering" | deep-dive | `tx::partitioned_lock::lock_partition` exists but fn body shows simple Mutex acquire — sorted-order proof not in module body. | 🟡 APPROXIMATE | Cite the specific test or remove "deadlock-free" until proof linked |
| C9 | "Reads never block (CoW snapshots)" | scores+deep-dive | No CoW snapshot module under `mvcc`/`cow`/`snapshot` (only `replication::snapshot` exists, unrelated). Architectural claim — no code anchor. | ❌ UNVERIFIABLE | Cite the actual CoW implementation module |

### 2.4 Query Efficiency claims (`metrics.queryEfficiency` + deep-dive)

| # | Claim | Source | Evidence | Verdict | Recommended update |
|---|---|---|---|---|---|
| Q1 | "182µs cross-modal vs 5-20ms 3-system stack" | scores+deep-dive | 182µs unverifiable (see L5). 5-20ms 3-system industry comparator. | ❌ UNVERIFIABLE for TrustDB number; ⚪ EXTERNAL for comparator | Cite the measurement code |
| Q2 | "spatial_then_graph 1.96ms" | deep-dive | No benchmark file contains 1.96ms or "spatial_then_graph". No multimodal results file exists. | ❌ UNVERIFIABLE | Run + cite, or delete |
| Q3 | "graph_then_search 1.05ms" | deep-dive | Same — no source. | ❌ UNVERIFIABLE | Run + cite, or delete |
| Q4 | "cascade_then_spatial 7.03µs" | deep-dive | Same — no source. | ❌ UNVERIFIABLE | Run + cite, or delete |
| Q5 | "GeoHash3D Encode 34.7ns" | deep-dive | `benchmark-results-v2`: `geohash3d_encode = 37.25ns`. Module name is `spatial::geohash` not `geohash3d` (305 LOC, **0 tests**, fan_in=0). Has 7 fns including encode/decode/bounding_box/neighbors. **No `geohash3d.rs` file** at the cited path. | 🟡 APPROXIMATE on number; 🔴 on file path | Update value to 37.25ns; fix path to `src/spatial/geohash.rs` |
| Q6 | "Jurisdiction Lookup 1.63µs" | deep-dive | No `jurisdiction` module in CodeGraph. No benchmark contains 1.63µs. | ❌ UNVERIFIABLE | Delete claim OR find/cite implementation |
| Q7 | "Typed Edge Filter 176µs (10/40 match)" | deep-dive | No benchmark file contains 176µs / "typed edge filter". `schema::edge_types` exposes media-domain edge types (`MediaEdgeType`), not the 11 canonical types claimed. | ❌ UNVERIFIABLE | Delete |
| Q8 | "150M evals/sec temporal decay (100-1000x app-layer)" | deep-dive narrative | 1/6.044ns = 165M/s — direction correct; "100-1000x" external estimate | ✅ VERIFIED direction; ⚪ comparator EXTERNAL | Keep with 165M/s; comparator label as external estimate |

### 2.5 Feature file claims

| # | Claim | Source | Evidence | Verdict | Recommended update |
|---|---|---|---|---|---|
| F1 | b-epsilon-tree: "core data structure ... write-optimized B-epsilon tree" | feature | **No module named `b_epsilon` / `bepsilon` / `b-epsilon` exists in CodeGraph.** 39 `tree::*` modules exist (`tree::tree` is 689 LOC, 3 tests; `tree::node` 814 LOC, 9 tests; `tree::aet` 206 LOC, 8 tests; `tree::flush` 658 LOC, 3 tests). The B-epsilon tree exists conceptually distributed across `tree::*` but no entry called "b-epsilon" anywhere. | 🟡 APPROXIMATE (capability exists; named differently) | Document the actual module structure (tree::tree + tree::node + tree::flush + tree::aet) |
| F2 | b-epsilon: "VMware patent-avoidance via sorted BTreeMap, not slot-based append-only" | feature | Cannot verify from CodeGraph alone (requires reading source of `tree::node`). Architectural assertion. | 🟡 APPROXIMATE | Mark as design intent; cite if there is an FTO doc |
| F3 | b-epsilon: "WAF 3.04 constant across configs" | feature | `tuning-grid-results-2026-03-29.md` mentions WAF behavior. Verified at headline level. | 🟡 APPROXIMATE | Keep with cite |
| F4 | b-epsilon: "Insert Scaling 1.53x cost (10x data)" | feature | No benchmark file contains 1.53x scaling number. | ❌ UNVERIFIABLE | Cite or delete |
| F5 | adaptive-epsilon: cited file `trustdb/src/tree/adaptive_epsilon.rs` | feature evidence | **Does not exist.** Actual: `tree::aet` (`src/tree/aet.rs`, 206 LOC, 8 tests). | 🔴 CONTRADICTED | Fix path: `src/tree/aet.rs` |
| F6 | adaptive-epsilon: "workload monitoring", "stats/workload_monitor.rs", "tree/flush_threshold.rs" | feature evidence | Neither file exists. `tree::aet` only exposes 2 fns (`compute_epsilon_at_split`, `maybe_halve_counters`) — no workload-monitor, no flush-threshold tuner. **The runtime-adaptive narrative is overstated** — current code only computes ε at split time and halves counters. | 🔴 CONTRADICTED | Rewrite to match actual scope (split-time ε computation + counter decay) |
| F7 | adaptive-epsilon: "converges in ~10s, <1% CPU monitoring" | feature | No monitoring loop exists. | ❌ UNVERIFIABLE | Delete or implement |
| F8 | cross-modal-queries: "182µs full_well_onboarding", spatial→graph 1.96ms, etc. | feature | Same as Q1-Q4. No source. | ❌ UNVERIFIABLE | Same remediation |
| F9 | full-text-search: cited file `trustdb/src/search/cwbm25.rs` | feature evidence | **Does not exist.** Actual: `search::bm25` (`src/search/bm25.rs`, 131 LOC, **0 tests**, has fn `cwbm25_score`). | 🔴 CONTRADICTED | Fix path: `src/search/bm25.rs`; add tests (0 currently) |
| F10 | full-text-search: cited file `trustdb/src/search/inverted_index.rs` | feature evidence | Not in CodeGraph; cannot verify. | ❌ UNVERIFIABLE | Verify or delete reference |
| F11 | full-text-search: "12,050 qps (100 sections)" / "1,095 qps (1K sections)" | feature | Actual benchmark says 775µs/query at 1K = 1290 qps. Claim of "12,050 qps at 100" is unsupported by any benchmark file. | 🟡 APPROXIMATE (1K) / ❌ UNVERIFIABLE (100) | Update 1K to 1,290 qps; delete 100-section claim until measured |
| F12 | depth-bounded-retrieval: cited files `dbrg.rs`, `pruning.rs`, `progressive.rs` | feature evidence | **None exist.** Actual: `query::depth_bounded` (1 test, 1 fn `depth_bounded_retrieve`) + `tests::dbrg_test` (14 tests). | 🔴 CONTRADICTED | Fix paths; note pruning + progressive are aspirational |
| F13 | depth-bounded: "Depth-2 traversal ~450µs", "40-80% pruning reduction", "<3% governance overhead" | feature | No benchmark file contains these numbers. | ❌ UNVERIFIABLE | Run + cite, or delete |
| F14 | geohash3d: cited files `geohash3d.rs`, `jurisdiction.rs` | feature evidence | **`geohash3d.rs` does not exist.** Actual: `spatial::geohash` at `src/spatial/geohash.rs` (305 LOC, **0 tests**, 0 fan_in). No `jurisdiction` module anywhere. | 🔴 CONTRADICTED | Fix path; jurisdiction code is missing entirely |
| F15 | geohash3d: "3D" encoding | feature | Module is named `geohash` and has 7 fns (`encode`, `decode`, `bounding_box`, `neighbors`, `to_bytes`, `from_bytes`, `is_prefix_of`). Whether 3D encoding (lat/lon/elevation) exists requires reading source; not provable from CodeGraph signatures alone. | 🟡 APPROXIMATE | Verify 3D-ness in source before claiming |
| F16 | gemvt: "Governance-Embedded MVCC Version Tokens" + paths `txn/gemvt.rs`, `tree/zone_maps.rs`, `security/fingerprint.rs` | feature | **`txn/gemvt.rs` does not exist; no `zone_maps` module; no `security::fingerprint`.** Only `substrate::dynamics::causal_calculus::gemvt_prior` exists (280 LOC, 6 tests) — this is a **substrate-mathematical "GEMVT prior" with fns `gemvt_visibility`, `classify_with_gemvt_prior`**, NOT an MVCC version token. The feature description does not match the existing code. Zone map only exists as a test (`tests::gym_g05_zone_map_pruning`, 8 tests). | 🔴 CONTRADICTED | Rewrite feature OR delete; the named module is unrelated |
| F17 | gemvt: "30-70% pages skipped, ~3ns fingerprint check, <2% maintenance overhead" | feature | No benchmark. No fingerprint module. | ❌ UNVERIFIABLE | Delete |
| F18 | graph-edges: "11 canonical edge types (CONTAINS, REFERENCES, ...)" + path `graph/edge_types.rs` | feature | **`graph/edge_types.rs` does not exist.** Actual `schema::edge_types` (455 LOC, 10 tests) exposes `MediaEdgeType` enum and 8 fns — domain-typed (media), not the 11 named types in the feature doc. | 🔴 CONTRADICTED | Reconcile to actual edge type model (MediaEdgeType + MediaEdgeCategory) or implement the 11 canonical types |
| F19 | graph-edges: "Edge Create 47,600/sec, Typed Filter 176µs, +15% confidence overhead" | feature | Same as Q7/T6. No source. | ❌ UNVERIFIABLE | Run + cite, or delete |

### 2.6 Fabric Flight / Mesh sub-claims (referenced in scorecard but covered under scalability — included because they affect performance assertions)

| # | Claim | Source | Evidence | Verdict | Recommended update |
|---|---|---|---|---|---|
| FF1 | "36-module exchange layer" | scores | CodeGraph: **47 `exchange::*` modules** + 1 `fabric_flight::*` + 2 `server::flight*` = ~50. Claim under-counts. | 🔴 CONTRADICTED | Update to "47 exchange modules + flight runtime" |
| FF2 | "~264 tests" in exchange | scores | CodeGraph sum: **346 tests** in `exchange::*`. | 🔴 CONTRADICTED (low) | Update to 346 |
| FF3 | "11-RPC surface" | scores | `exchange::rpc_surface` has 11 distinct *Request types (OpenSession, UpdateSession, UpdateSpatialVolume, Traversal, Materialize, PushDeltas, QueryGaps, SubscribeBeliefs, SpatialStream, ExchangeAtoms, Veil). | ✅ VERIFIED | Keep |
| FF4 | "GEMVT 0.024% false-positive causal ordering" | scores | `substrate::dynamics::causal_calculus::gemvt_prior` — 2 fns, 6 tests. Does not contain a false-positive measurement. No benchmark file mentions 0.024%. | ❌ UNVERIFIABLE | Run + cite or delete |
| FF5 | "QUIC ~25% throughput / 28% p50 reduction vs gRPC" | scores | `exchange::quic_transport` exists (1210 LOC, 12 tests). No benchmark file contains these comparison numbers. | ❌ UNVERIFIABLE | Cite or label "design target" |
| FF6 | "io_uring zero-copy: zero heap allocs for 1GB EpistemicBundle" | scores | `storage::io_uring_storage` exists (191 LOC, **0 tests**). No benchmark validates the 1GB / zero-alloc claim. | ❌ UNVERIFIABLE | Cite or label "design target" |

---

## 3. Proposed Corrected Content (JSON Patch)

Replace selected fields. ✅ = drop-in safe; 🔴 = remediate before shipping.

```jsonc
// scores.json → pillars.performance.metrics
{
  "latency": {
    "score": 7.5,  // 🔴 dropped from 8.8 — many cited benchmarks unverifiable; concurrency stack shelf-ware
    "summary": "Measured: point write 19.4µs, point read 21.6µs (criterion, in-memory). Batch write 100: 1.80ms. Range scan 1K: 524µs. GeoHash encode 37ns. TDQP decay 6.0ns, RRMS decay 12.1ns. FileIo (NVMe tuned) 8,616 ops/s. Cross-modal onboarding number (182µs) is currently unsourced — requires re-running multimodal harness.",
    "lastUpdated": "2026-05-13"
  },
  "throughput": {
    "score": 6.5,  // 🔴 dropped from 8.3 — headline ops/s numbers are 1/latency-derived, not measured; coalescer claim has no implementation
    "summary": "Derived from latency: ~51.5K write ops/s, ~46.3K read ops/s (1/measured-latency, not throughput-benchmarked). FileIo 8,616 ops/s on NVMe (tuned, measured). Batch write 100: 55.6K ops/s (corrected from prior 106K). CW-BM25 (1K sections): 1,290 qps (1/775µs). Coalesce-ratio and CentralHashBuffer claims removed pending implementation.",
    "lastUpdated": "2026-05-13"
  },
  "concurrency": {
    "score": 5.5,  // 🔴 dropped from 8.0 — PR #247 modules exist but fan_in=0 (shelf-ware)
    "summary": "Built but not wired: PartitionedLockManager (209 LOC, 5 tests), PartitionedTx (339 LOC, 6 tests), ConflictGraph (431 LOC, 5 tests), EpochGuard (212 LOC, 5 tests), EpochTable (127 LOC, 3 tests). 27 tests pass in isolation. Production store path does not consume these modules (CodeGraph fan_in=0 for ConflictGraph/EpochGuard/PartitionedTx). FNV-1a 9-byte prefix hash routes to configurable stripes (default rounds to power of 2). Score will rise to 8.0 once wired to store.",
    "lastUpdated": "2026-05-13"
  },
  "queryEfficiency": {
    "score": 6.0,  // 🔴 dropped from 9.0 — 182µs/1.96ms/1.05ms/7.03µs/1.63µs/176µs all unsourced
    "summary": "Cross-modal benchmarks (full_well_onboarding 182µs, spatial→graph 1.96ms, graph→search 1.05ms, cascade→spatial 7.03µs, jurisdiction 1.63µs, typed edge filter 176µs) have no source file or runnable script in the repository. Verified primitives: GeoHash encode 37ns, TDQP 6ns, RRMS 12ns, range scan 524µs. The cross-modal advantage is architecturally sound (single-process, no serialization) but the headline numbers must be re-measured before publication.",
    "lastUpdated": "2026-05-13"
  }
}
```

```jsonc
// benchmarks.json → sources[] — sources flagged as MISSING on disk
{
  "geo":         { "status": "MISSING_FILE", "note": "Cited path Research/Benchmarks/geo_benchmark_results.json does not exist on disk" },
  "simd":        { "status": "MISSING_FILE", "note": "simd_benchmark_results.json does not exist on disk" },
  "multimodal":  { "status": "MISSING_FILE", "note": "trustdb_multimodal_benchmark_results.md does not exist on disk; all 182µs / 1.96ms / 1.05ms / 7.03µs / 47,600 edges/s / 176µs / 1.63µs / 35µs/hop / 98.6ms numbers are unsourced" },
  "locality":    { "status": "MISSING_FILE", "note": "DB-Gym-Locality-Raw-2026-03-31/ does not exist on disk; 43µs/59µs p50 locality numbers unsourced" },
  "competitive": { "status": "MISSING_FILE", "note": "TrustDB-vs-Graph-Databases-2026-03-31.md does not exist on disk; 5.8M× projection traces to Research/Data Interchange/API/TrustDB — Epistemic Data Architecture... which warns the projection 'must not be presented as a measured result'" }
}
```

```jsonc
// Feature evidence paths — replace fictional with real
{
  "adaptive-epsilon.evidence": [
    { "label": "AET (ε at split + counter halving)", "path": "trustdb/src/tree/aet.rs" }
    // remove workload_monitor.rs and flush_threshold.rs (do not exist)
  ],
  "full-text-search.evidence": [
    { "label": "BM25 + CWBM25 score fn", "path": "trustdb/src/search/bm25.rs" }
    // remove cwbm25.rs and inverted_index.rs (do not exist as modules)
  ],
  "depth-bounded-retrieval.evidence": [
    { "label": "Depth-bounded retrieve fn", "path": "trustdb/src/query/depth_bounded.rs" },
    { "label": "DBRG integration tests (14)", "path": "trustdb/tests/dbrg_test.rs" }
    // remove dbrg.rs, pruning.rs, progressive.rs (none exist)
  ],
  "geohash3d.evidence": [
    { "label": "Geohash encoder/decoder (305 LOC, 0 tests, fan_in=0)", "path": "trustdb/src/spatial/geohash.rs" }
    // remove jurisdiction.rs (does not exist)
  ],
  "gemvt.evidence": [
    { "label": "GEMVT prior (substrate causal calculus, NOT MVCC token)", "path": "trustdb/src/substrate/dynamics/causal_calculus/gemvt_prior.rs" }
    // remove txn/gemvt.rs, tree/zone_maps.rs, security/fingerprint.rs (none exist)
    // OR: rewrite the feature card to match actual scope (governance visibility classifier), not MVCC token claim
  ],
  "graph-edges.evidence": [
    { "label": "Schema edge types (MediaEdgeType, 10 tests)", "path": "trustdb/src/schema/edge_types.rs" }
    // The "11 canonical edge types CONTAINS/REFERENCES/..." narrative does not match the actual MediaEdgeType enum
  ]
}
```

---

## 4. Honest Gaps (DoD-disclosure items)

These claims **cannot be substantiated** and must be either remediated (re-run benchmark / find/build source / delete) before shipping to DoD:

1. **52,100 / 45,200 ops/s throughput** — derived from 1/latency, never measured as throughput. Either drop or relabel as "1/latency derived".
2. **940µs batch write / 106,400 ops/s** — actual measured is 1.80ms / 55,556 ops/s. **52% misrepresentation**. Must correct.
3. **193,000 ops/s coalesced batch** + "8-10x fewer CAS" + "90% coalesce ratio" — no `write_coalescer` or `CentralHashBuffer` module exists. Pure assertion.
4. **182µs cross-modal onboarding** + all multimodal benchmarks (1.96ms / 1.05ms / 7.03µs / 47,600 edges/s / 1.63µs / 176µs / 35µs/hop / 98.6ms digital twin / 12,050 qps search at 100) — no source benchmark file exists. Run the multimodal harness and ship the actual file, or delete the claims.
5. **5.8M× faster than Neo4j at 41.6M nodes** — source document explicitly states this is a **theoretical extrapolation** and "must not be presented as a measured result". DoD deck must either (a) drop the number, (b) label it "projected from cache-oblivious extrapolation, not measured", or (c) measure it. Currently violates the source's own caveat.
6. **PR #247 multi-writer concurrency** — code exists in isolation but has **fan_in=0** into the production store path. Modules are dead code. Either wire to store or drop the 8.0 concurrency score.
7. **CWBM25 implementation** — `search::bm25` has **zero tests** and contains a `cwbm25_score` fn, but no dedicated CWBM25 module / inverted index module exists at cited paths. The product claim is in a 131-LOC file with no test coverage.
8. **GEMVT** — feature card describes a "Governance-Embedded MVCC Version Token" with zone maps + fingerprints; **none of these modules exist**. The only `gemvt_prior` module is unrelated substrate-mathematical code. Feature card must be rewritten or deleted.
9. **Adaptive Epsilon Tuning (AET)** — feature card describes runtime workload monitoring with EWMA convergence; actual `tree::aet` only has 2 fns (`compute_epsilon_at_split`, `maybe_halve_counters`). No workload monitor exists. Narrative is significantly overstated.
10. **11 canonical edge types (CONTAINS/REFERENCES/DERIVED_FROM/...)** — actual `schema::edge_types` exposes `MediaEdgeType` (media-domain), not the universal 11 types claimed. Either build the 11 types or rescope the claim.
11. **Jurisdiction lookup 1.63µs / 100pts** — no `jurisdiction` module exists. Implementation is missing entirely.
12. **CoW snapshots for lock-free reads** — claimed as a core mechanism, but no `cow` / `mvcc` / `snapshot` module exists under the store namespace (only `replication::snapshot`, unrelated). Architectural claim needs a code anchor.
13. **NVM Tier 1 ~50ns / dc cvap fences** — industry-standard hardware spec; not internally measured. Label as external benchmark.
14. **QUIC ~25% throughput / 28% p50 reduction** — `exchange::quic_transport` exists but the comparison numbers are not in any benchmark file. Likely from Fabric Flight v1.0 spec design doc, not from a runnable benchmark.
15. **io_uring zero-copy zero heap allocs (1GB bundle)** — `storage::io_uring_storage` has 0 tests; claim is an aspirational design target.

---

## 5. Bottom Line

The Performance pillar in its current form **cannot be defended in front of a DoD technical reviewer**. 11 numeric claims are directly contradicted by code or benchmarks; 17 cite source files that do not exist on disk; the centerpiece "8.0 concurrency" claim is built on isolated modules with zero production fan-in.

**Two paths forward before DoD presentation:**

- **Path A (fast, honest):** Strip the unverified numbers; lead with the 5 verified measurements (point write 19.4µs, point read 21.6µs, GeoHash 37ns, TDQP 6ns, FileIo 8616 ops/s). Drop scores to 6.0-7.0 range. Add an explicit "Verification trajectory" section noting which claims need benchmarking before audit-grade defensibility. This is shippable in <1 day.

- **Path B (correct, slower):** Run the multimodal benchmark harness (must locate or build it — no harness file exists at cited paths), wire PR #247 modules into the store path, build the missing jurisdiction/cwbm25 modules, and re-cite. Realistic timeline: 2-3 weeks.

Path A is recommended for DoD; Path B can follow as a "v1.1" update.
