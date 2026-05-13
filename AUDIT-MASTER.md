# TrustDB Scorecard — Ground-Truth Audit (Master Report)

**Audit date:** 2026-05-13
**Audited against:** CodeGraph snapshot `trustdb:main` (loaded 2026-05-13T18:18:57Z; 3,365 modules / 1.34M LOC / 53,153 fns) + on-disk repos + GitHub PRs
**Scorecard build:** 2026-04-06 (~5 weeks stale)
**Purpose:** Pre-flight before US DoD presentation. Per user-binding doctrine: *"calibration must be tested, not stated; cheating is forbidden; truth is the goal."*

---

## 1. Bottom line

| Pillar | Current score | Defensible score | Verified | Contradicted | Unverifiable | Action class |
|---|---|---|---|---|---|---|
| Performance | 8.5 | **6.5–7.0** | 16/51 (31%) | 11 | 17 | Strip unverified or re-run |
| Reliability | 9.5 | **8.7** | majority | 3 (incl. SSI→SI) | several | Word changes + count corrections |
| Scalability | 8.6 | **7.8** | mixed | 3 (QUIC/io_uring/NUMA) | several | Remove fabricated transport-perf numbers |
| Security | 8.7 | **8.4** | many | FROST, FHE-prod | LDP/ORAM bucket inflated | Relabel + correct attribution |
| Efficiency | 9.4 | **7.5–8.0** | 3 | 1 (Graviton) | 13 | Strip inferred power claims |
| Connectivity | 8.2 | **7.0** | many | 6 (PR repo, TEP files, demo app, workloads, JS, targets) | mixed | Repo attribution + path fixes |
| **Overall** | **8.7** | **~7.5** | | | | |

**Single most important finding:** the scorecard is built on a foundation of measured + verifiable substrate work, but the marketing layer materially overstates several headline numbers and cites PRs against the wrong GitHub repository. For a DoD audience that may cross-check public sources, this is fixable but **must be fixed before the demo.**

---

## 2. Most material issues (any one of these would embarrass us in a DoD Q&A)

### A. PR numbers cite the WRONG GitHub repo
Every PR reference (`PR #148`, `#218`, `#231`, `#247`, `#250`, `#201`) appears to come from `DIGITAL-FABRIC-AI/FabricRS`. On the current source-of-truth `DIGITAL-FABRIC-AI/trustdb`, those same PR numbers refer to entirely unrelated work:

| Claim in scorecard | trustdb PR #N (actual title) | FabricRS PR #N (actual title) |
|---|---|---|
| PR #247 "concurrency + WAL HMAC" | "Tensor Field Intersection Detection in WTIM" | ✅ "multi-writer concurrency + WAL HMAC chain" |
| PR #148 "Swift C-FFI 5 targets" | "CE Tier 2 — AnergyPool/CytokineCascade" | ✅ "macOS Apple Silicon + Swift FFI wrapper" |
| PR #218 "Apple ecosystem 5 targets" | "PERF-B Lock-Free Concurrency" (CLOSED) | ✅ "Complete next-gen federated architecture" |
| PR #231 "Python PyO3" | "GEO-B Hilbert spatial index" (CLOSED) | "Lens API + TEP + Arrow Flight + Grafana" — **not actually Python PyO3** |
| PR #250 "Compliance SOX/HIPAA SIEM" | "docs: cloud CodeGraph REST API" | ✅ "compliance export + SIEM" |
| PR #201 "Self-draining conflict pipeline" | "XLSX/spreadsheet extractor" | ✅ "Phase 1+2 self-draining conflicts" |

**Risk:** A DoD reviewer who clicks "github.com/DIGITAL-FABRIC-AI/trustdb/pull/247" sees something completely different from what the scorecard claims.
**Fix (mandatory):** retag every PR reference as `(FabricRS PR #N)` OR migrate them to the current trustdb repo's PR numbers OR remove PR references altogether.

### B. Raw benchmark files cited in `benchmarks.json` do not exist on disk
The `bySource` block names 5 raw evidence files. **None exist anywhere on D: drive:**
- `Research/Benchmarks/geo_benchmark_results.json` — missing
- `Research/Benchmarks/simd_benchmark_results.json` — missing
- `Research/Benchmarks/trustdb_multimodal_benchmark_results.md` — missing
- `Research/Benchmarks/DB-Gym-Locality-Raw-2026-03-31/` — missing
- `Research/Benchmarks/TrustDB-vs-Graph-Databases-2026-03-31.md` — missing

Result: **all 12 cross-modal numbers** (182µs onboarding, 1.96ms spatial→graph, 1.05ms graph→search, 7.03µs cascade→spatial, 47,600 edges/s, 1.63µs jurisdiction, 176µs typed filter, 35µs/hop meta-edge, 98.6ms digital twin, 12,050 qps search, 0.05ms 3-hop, 5.8M× projection) are **unsourced**. The scorecard cites them; the sources don't exist.

Some scorecard claims appear to be **1/latency arithmetic, not measured**: 52,100 ops/s ≈ 1/19.2µs; 45,200 ≈ 1/22.1µs.

**Worst case discovered:** scorecard says `batch_write_100 = 940µs`. Actual measured: `1.800ms`. **52% misrepresentation in TrustDB's favor.** Implies 2× faster than reality.

### C. "Serializable Snapshot Isolation (SSI)" is not implemented — it's plain SI
`tx::transaction::commit()` has zero conflict detection. No `ssi` / `serializable` / `mvcc` modules surface in CodeGraph. The cow-mvcc feature file cites a non-existent `src/txn/ssi.rs`. Claim appears in scores.json (reliability), deep-dives/reliability.json, cow-mvcc.json, and the Neo4j matchup ("Serializable SSI vs Read Committed"). The Neo4j matchup as written is dishonest.

**Fix:** rewrite consistency claim as "Snapshot Isolation" (truthful) and update Neo4j matchup accordingly.

### D. PR #247 concurrency stack is shelf-ware
`concurrency::conflict_graph` (fan_in=**0**), `concurrency::epoch_guard` (fan_in=**0**), `tx::partitioned_tx` (fan_in=**0**). All 27 tests pass in isolation but **none are wired into the production store path**. The "8.0 concurrency, multi-writer MVCC" score is built on dead code. The supporting Raft modules ARE wired and tested (16 modules / 117 tests confirmed).

### E. io_uring zero-copy claim is a stub
`storage::io_uring_storage` (191 LOC, **0 tests**). `write_page` literally returns `Err("IoUringStorage not yet implemented")`. Source comments: "Phase 5b: This will actually probe the kernel". The "Zero heap allocs for 1 GB EpistemicBundle" + "Server CPU does not touch Hologram payload" claims have **no implementation backing**.

### F. NUMA "80%+ parallel efficiency" — no NUMA module exists
`?filter=numa` → 0 modules. `exec::morsel` is 99 LOC / 1 test. The 80% number has no source.

### G. QUIC "~25% throughput / 28% p50 latency reduction" — no bench exists
`exchange::quic_transport` (1,210 LOC, 12 tests) is real codec code, but `external_deps = ['serde', 'uuid']` — **no quinn QUIC engine dependency**. `benches::fabric_flight_bench` exists but contains no QUIC-vs-gRPC benchmark.

### H. Several power/efficiency numbers are inferred, not measured
Per `benches/power_savings_bench.rs:30` source comment: *"Power figures are inferred from CPU-time × active-mode current draw (not directly measured)."* The 384 mW vs 3,995 mW SQLite comparison (9.1× claim) is computed, not benchmarked. The 3,000× NVMe energy reduction has no `lpsr`/`lpddr`/`pasr` module backing.

### I. "Graviton ARM64 Fargate deployed" — false
No `aarch64`/`arm64`/`graviton` in any deploy workflow on disk.

### J. Internal contradictions (scorecard vs itself)
- `scores.json` says JS gRPC driver is included; `deep-dives/connectivity.json` says "Not yet, met:false". Reality: `@trustdb/client` v0.1.0 with 433 LOC TypeScript + real `@grpc/grpc-js` **does exist**. scores.json is right.
- `wal-group-commit.json` says "FNV32 checksums"; scores.json says "HMAC-SHA384 chained". Reality: HMAC-SHA384 (verified). The feature file is pre-PR-#247 stale.
- "CBAC 116 tests" (benchmarks line 202) vs "99 tests" (scores summary). Reality: 141 src or 206 with test files — both numbers are wrong, both downward.

---

## 3. Findings in TrustDB's favor (numbers were UNDER-stated)

The audit also found the scorecard understates real work in several places. After corrections these become stronger claims, not weaker:

| Claim | Scorecard | Actual (CodeGraph) | Direction |
|---|---|---|---|
| Raft modules | 13 / 4,896 LOC / 106 tests | **16 / 7,278 LOC / 117 tests** | understated |
| Exchange layer | 36 modules / ~264 tests | **47 modules / 346 tests** | understated |
| Security LOC (14 modules) | 15,913 LOC | **25,343 LOC across 94 submodules in 14 namespaces** | understated 60% |
| Adversarial gym tests | 168 / 15 files | **321 across 28 files** (after excluding non-security gyms) | understated ~2× |
| CBAC tests | 99 (or 116 elsewhere) | **141 src / 206 with test files** | understated |
| RDKC tests | 92 | **95 src / 149 total** | understated |

**Strong claims to re-verify and lead with:**
- **`compliance::export::build_attestations`** literally returns 7 ControlAttestations with exact strings — NIST AU-10/AU-2/AU-3/AU-12, HIPAA 164.312(b)/(c)(1), SOX 404. Code-grounded 1:1. Lead with this at DoD.
- **ML-KEM-1024 + X25519 hybrid PQ transport** — `rdkc::transport` (475 LOC, 5 tests) with `ml_kem` + `x25519_dalek` deps. Real. Scorecard wrongly marks feature status "designed".
- **ML-DSA-87 post-quantum signatures** — `cam::ml_dsa87_provider` (287 LOC, 9 tests) exists. Scorecard wrongly lists this as a "gap."
- **WAL HMAC-SHA384 chain** — `wal::hmac` (439 LOC, 9 tests) with `compute_chained_hmac` + `verify_wal_chain` + `WalProvenance` — verified.
- **11-RPC Fabric Flight surface** — `exchange::rpc_surface` exports exactly 11 distinct `*Request` structs. Exact match.
- **3 transport adapters** — BLE (394/9), HTTPS (442/10), UWB (358/9). Real codecs (caveat: they're codecs, not radio drivers — Apple Watch/AirPods/Vision Pro pairings are aspirational).
- **GEMVT 0.024% FP** — mathematically derived from 12-bit CAUSAL_FP_MASK = 2⁻¹² ≈ 0.0244%. Math is sound; clarify "mathematical, not empirically measured."
- **DeviceManifest 5-tier** — `DeviceTier` enum has exactly 5 unit variants (Mothership/Regional/Desktop/Mobile/EdgeSensor). Verified.
- **5 #[instrument] OTel macros** + **2 Grafana dashboards** + Arrow Flight feature-gated + Python PyO3 bindings (~2,200 LOC, 4 named classes) + Swift C-FFI — all verified.

---

## 4. Aspirational claims that need explicit "planned / designed" tags

| Claim | CodeGraph reality | Status |
|---|---|---|
| FROST threshold signatures | `eacb::quorum` has `ThresholdVerifier` trait + `MockVerifier` only; no `frost`/`schnorr` modules | Designed, not implemented |
| FHE in production | 14/19 FHE tests in `fhe::mock`; no `tfhe-rs`/`concrete` deps | Mock-only |
| io_uring zero-copy | Acknowledged stub; returns `not yet implemented` | Phase 5b future work |
| NUMA-aware morsel-driven exec | 0 NUMA modules; morsel is 99 LOC / 1 test | Aspirational |
| QUIC transport via quinn | No quinn dep; quic_transport is codec only | Codec only |
| Graviton ARM64 Fargate "deployed" | No aarch64 in deploy workflow | Not deployed |
| LPDDR5X PASR via mmap separation | 0 modules | Architectural narrative |
| Windows VirtualLock + NUMA allocation | No Win32 in source | Not implemented |
| LDP+ORAM+FHE = 39 tests (privacy stack) | Number matches but bucket includes mock-FHE; LDP is 11 tests | Misleading bucket |
| TrustDbDemoiOS Swift demo app | No `*Demo*` files / `.xcodeproj` | Doesn't exist |
| DB-Gym 17 workloads | `db_gym::workloads::all()` returns 12 | 12, not 17 |
| Apple targets: iOS, watchOS, macOS, tvOS, visionOS | 5 Rust target triples = iOS / iOS-sim / watchOS / watchOS-sim / darwin (no tvOS, no visionOS) | 3 platforms |

---

## 5. Per-pillar verdicts (full detail in per-pillar audit files)

- **Performance audit:** `AUDIT-PERFORMANCE.md` (227 lines) — accuracy ~31%; biggest issue is unsourced cross-modal numbers + dead concurrency stack
- **Reliability audit:** `AUDIT-RELIABILITY.md` (218 lines) — main issue: SSI claim is false (it's SI); Raft is understated, NVM tests off 18×
- **Scalability audit:** `AUDIT-SCALABILITY.md` (237 lines) — Fabric Flight transport-perf numbers fabricated; FWGA 5-tier IS verified
- **Security audit:** `AUDIT-SECURITY.md` (275 lines) — strongest pillar; PQ-crypto actually IMPLEMENTED but mislabeled "designed"; relabel FROST/FHE-prod
- **Efficiency audit:** `AUDIT-EFFICIENCY.md` (216 lines) — power numbers inferred not measured; 3,000× NVMe + LPDDR5X + Graviton claims unsupported
- **Connectivity audit:** `AUDIT-CONNECTIVITY.md` (280 lines) — PR repo confusion; TEP evidence files missing; SwiftUI demo doesn't exist

Total: 1,453 lines of per-claim verdict tables with CodeGraph evidence + JSON correction blocks.

---

## 6. Two paths forward (decision needed)

### Path A — Ship a defensible scorecard in <24 hours
1. Strip every unverified number (cross-modal benches, power inference, QUIC/io_uring/NUMA, 3,000× energy, 5.8M× projection caveats)
2. Replace with the verified subset (point write 19.4µs, point read 21.6µs, geohash encode 37ns, TDQP 6.04ns, FileIo 8,616 ops/s, exact module/test counts from CodeGraph)
3. Relabel aspirational items as "Designed" / "Phase 2"
4. Retag PR references with `(FabricRS PR #N)` or remove
5. Correct internal contradictions (SI not SSI; HMAC-SHA384 not FNV32; 5 enum variants for DeviceTier; etc.)
6. Surface the **understated** counts (Raft 16 modules, 7,278 LOC; exchange 47 modules / 346 tests; ML-KEM-1024 actually implemented; ML-DSA-87 actually implemented)
7. Drop scores to defensible range (overall ~7.5)
8. Add a "Verification Trajectory" section: what's measured, what's designed, what's planned
9. Rebuild the React SPA + redeploy to CloudFront + (optionally) set up `scorecard.digital-fabric.com` custom domain

**Estimated effort:** 4–8 hours of focused work. Shippable for the DoD demo.

### Path B — Re-run all benchmarks and ship a fully-measured scorecard
1. Re-create the 5 missing raw benchmark files by re-running DB-Gym, criterion, multimodal, geo, simd, competitive suites
2. Wire PR #247 concurrency stack into the production store path (currently fan_in=0)
3. Implement io_uring zero-copy (currently a stub)
4. Implement NUMA-aware morsel execution
5. Add quinn QUIC engine and measure throughput vs gRPC
6. Bench Graviton ARM64 and deploy ECS to it
7. THEN re-do this audit and rebuild

**Estimated effort:** 2–3 weeks. Cannot be done before any near-term DoD demo.

**Recommended: Path A.** Path B is the right long-term answer but Path A is what ships now and is fully defensible.

---

## 7. Concrete next-step ask (decision the user needs to make)

1. Approve **Path A** vs Path B (or hybrid).
2. Decide PR-reference treatment: (a) retag as `(FabricRS PR #N)`, (b) remove all PR refs, (c) migrate to trustdb equivalents.
3. Decide what to do with the **score deltas** (overall 8.7 → 7.5). DoD audiences favor calibrated honesty over inflated optimism — recommend acknowledging the score change with a "Calibrated 2026-05-13" timestamp.
4. Decide whether the bundle rebuild is in scope for this session (the JSON corrections are ready to apply per the per-pillar audit files).

Once decided, the per-pillar JSON correction blocks (already drafted in each audit file) can be applied in one pass, the React app rebuilt, and the CloudFront distribution invalidated — total ~2 hours.
