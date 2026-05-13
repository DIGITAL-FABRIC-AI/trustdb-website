# Efficiency & Cost Pillar — Code-Grounded Audit

**Auditor:** Background session (read-only investigation)
**Date:** 2026-05-13
**Audience:** Public-facing US DoD scorecard
**Method:** CodeGraph primary; direct filesystem fallback when CodeGraph snapshot does not cover a crate; explicit verification of every numeric claim against source-of-truth (constant in code, bench file, or output artifact).
**Doctrine:** "100% or failure" calibration. No tolerance loosening. No cheats. Every unverified number flagged honestly.

---

## 1. Executive Summary

The Efficiency & Cost pillar is currently scored **9.4** ("excellent") on the strength of dramatic claims:
- 3,000× NVMe storage energy reduction
- 9.1× lower CPU power than SQLite (384 mW vs 3,995 mW)
- 24.8× lower delta-over-idle (157 mW vs 3,896 mW)
- WAF 3.04, Bincode 3.3%, Governance 49× cheaper, Write Confidence +28%
- Graviton ARM64 Fargate "deployed" with 20% cost reduction
- TDQP 6.67 ns, RRMS 10.3 ns
- Windows VirtualLock + NUMA, LPDDR5X PASR, LPSR preservation

**Verdict for the pillar as a whole: SCORE INFLATED by undocumented benchmarks.** The architectural primitives that *would* produce these numbers (BatteryStateMonitor, apple_qos, codec_pipeline, write_amplification_bench, power_savings_bench) **mostly exist** in code. The specific *numeric claims* mostly **cannot be verified**:

- 4 cited evidence files (`trustdb_final_benchmark_report.md`, `MACBOOK-BENCHMARK-HANDOFF.md`, `geo_benchmark_results.json`, `simd_benchmark_results.json`) **DO NOT EXIST** anywhere on disk under `D:/Digital Fabric/`.
- No deployment workflow uses `aarch64`/`arm64`/`graviton`/`ARM64` — Graviton "deployed" claim is contradicted by CI config.
- No Win32 `VirtualLock` / `VirtualAllocExNuma` symbols exist anywhere in the trustdb source tree.
- `LPDDR5X`, `PASR`, and `LPSR` are not mentioned in any source file.
- 79 mW / 5,200 mW figures cited in scores.json appear nowhere in source.
- 6.67 ns / 10.3 ns / 157 mW / 3,000× are not present as constants or in any bench file/artifact in-tree.

**The benchmark source files themselves are honest:** `power_savings_bench.rs` line 30 says verbatim that *"Power figures are inferred from CPU-time × active-mode current draw (not directly measured)."* The bench measures CPU time and flush count, not power. The scorecard then publishes a power number as if measured.

**Recommendation:** the pillar headline numbers should be either (a) **re-run** with output artifacts committed to the repo and a stable evidence path, or (b) **removed** from the public DoD scorecard until verifiable. As stands, the pillar is unsuitable for DoD presentation: it advertises 9.1× advantages where the underlying measurements either don't exist or are explicitly inferences. Recommended interim score: **6.5–7.0** based on verified architecture primitives (BatteryStateMonitor, QoS, B-ε write coalescing) without the inflated numeric headlines.

---

## 2. Verdict Table

| # | Claim | Verdict | Evidence in code | Evidence missing |
|---|---|---|---|---|
| **C1** | "3,000× NVMe storage energy reduction via LPSR preservation" | ❌ UNVERIFIABLE | `wikai-core/crates/trustdb-nvm/src/battery_monitor.rs` (epoch batching exists); `intelligence::temporal_decay` | "LPSR" not in any source; no bench that measures NVMe power; no measurement methodology |
| **C2** | "9.1× lower CPU power than SQLite (384 mW vs 3,995 mW)" | ❌ UNVERIFIABLE | `hardware::apple_qos` (406 LOC, 8 tests, real QOS_CLASS pinning); `benches::sqlite_comparison_bench` (real `rusqlite` baseline) | `power_savings_bench.rs:30` source comment: *"Power figures are inferred from CPU-time × active-mode current draw (not directly measured)"*. No power-meter capture. 384/3,995 mW not in any source or artifact. |
| **C3** | "QoS E-core pinning: 79 mW vs 5,200 mW P-core" | ❌ UNVERIFIABLE | `hardware::apple_qos` exists and pins via `QOS_CLASS_BACKGROUND` | 79 mW / 5,200 mW values appear nowhere in source. `grep` for "79mW", "5_200", "5200mW" → 0 hits. Numbers are aspirational. |
| **C4** | "BatteryStateMonitor: 5 ms charging, 500 ms low battery, disabled in Low Power Mode" | ✅ VERIFIED | `wikai-core/crates/trustdb-nvm/src/battery_monitor.rs:42-46`: literally `Charging => Some(Duration::from_millis(5))`, `LowBattery => Some(Duration::from_millis(500))`, `LowPowerMode => None`. 12 tests (`tier2_intervals`, `tier2_enabled`, etc.). | (none — fully verified) |
| **C5** | "LPDDR5X PASR via hot/cold mmap separation" | ❌ UNVERIFIABLE / aspirational | (none) | `grep -r "PASR\|LPDDR5X\|LPSR"` → 0 hits in all of `trustdb/src/`. `pasr` and `lpddr` filters in CodeGraph return `[]`. This is **architectural narrative without code**. |
| **C6** | "Windows VirtualLock + NUMA allocation" | ❌ UNVERIFIABLE | (none) | `VirtualLock`/`VirtualAllocExNuma` → 0 hits in source. CodeGraph `?filter=virtuallock`/`?filter=numa` → `[]`. NUMA mentions in `exec/morsel.rs` and `index/hnsw.rs` are unrelated to Windows page pinning. |
| **C7** | "WAF 3.04 (constant across configs)" | 🟡 APPROXIMATE | `benches::write_amplification_bench` (300 LOC) exists; measures `physical_page_writes / logical_writes` via `WatCounters` | 3.04 not in source. Bench prints "WAF[n=N]: X.XXX×" to stderr only; no captured artifact in-tree. "constant across configs" is *contradicted* by bench source which sweeps `n_inserts ∈ {10, 100, 1000, 10000}` — by design WAF varies with batch. |
| **C8** | "Bincode codec 3.3% overhead" | ❌ UNVERIFIABLE | `bincode = "1"` in `trustdb/Cargo.toml`; `Codec::Bincode` used in `sqlite_comparison_bench`; `encoding::codec_pipeline` (612 LOC) is the actual codec layer (hybhuff + zstd) | No dedicated bincode-overhead bench file. CodeGraph `?filter=bincode` → `[]`. No artifact captures the "3.3%" number. Misleading attribution: TrustDB's real production codec is `codec_pipeline` (hybhuff + zstd), not raw bincode. |
| **C9** | "Governance 49× cheaper than app-layer (3.3% vs 163%)" | ❌ UNVERIFIABLE | `runtime::governance_instance` (1,121 LOC, 18 tests), `cbac::*`, `zk::governance_air` all exist | The 49× ratio (= 163%/3.3%) is arithmetic on two numbers, neither of which is sourced. No bench measures app-layer 163% baseline. |
| **C10** | "Graviton ARM64 Fargate: 20% cost + 30% perf (deployed)" | 🔴 CONTRADICTED | (none) | No deploy workflow uses `aarch64`/`arm64`/`graviton`/`ARM64`. Confirmed via `Grep` across `digital_fabric/.github/workflows/` and `trustdb/.github/workflows/`. "(deployed)" is **false** as of audit. Per CLAUDE.md MEMORY.md, current deploy target is `digital-fabric-production` ECS on standard Fargate; no Graviton instance type. |
| **C11** | "CPU Power (QoS:BACKGROUND): 384 mW" | ❌ UNVERIFIABLE | (architecture) `hardware::apple_qos::WorkloadType::BackgroundComposition → QoSClass::Background` is real | 384 mW value not in source. Cited evidence file `MACBOOK-BENCHMARK-HANDOFF.md` does not exist anywhere under `D:/Digital Fabric/`. |
| **C12** | "Delta Over Idle: 157 mW" | ❌ UNVERIFIABLE | (none) | 157 mW not in source. No idle-baseline measurement methodology in any bench. |
| **C13** | "TDQP Decay Eval: 6.67 ns (150M evals/sec)" | ❌ UNVERIFIABLE | `intelligence::temporal_decay` (652 LOC, 18 tests) and `query::temporal_decay` (408 LOC, 20 tests) both exist; `apply()` is `#[inline]` pure math | No `temporal_decay_bench.rs` file. 6.67 ns / 150M evals/sec not in any source or Criterion output in-tree. Number is plausible-order-of-magnitude (one `f64::exp` call) but unmeasured. |
| **C14** | "RRMS Reinforced Decay: 10.3 ns" | ❌ UNVERIFIABLE | `rrms::unified_counter` (263 LOC, 21 tests), `rrms` (181 LOC), `consolidation::rrms_consolidation` (151 LOC, 9 tests) exist | 10.3 ns not in source. No dedicated RRMS bench. Cited evidence paths (`trustdb/src/belief/rrms.rs`, `trustdb/src/primitives/access_counter.rs`) **do not exist** — actual paths are `src/rrms/mod.rs` and `src/rrms/unified_counter.rs`. |
| **C15** | "Write w/ Confidence Overhead: +28%" | ❌ UNVERIFIABLE | `types::confidence` (676 LOC, 12 tests) exists | No bench captures the +28% figure. Cited evidence file `trustdb_final_benchmark_report.md` does not exist. |
| **C16** | "Write Amplification Factor 3.04" (data-footprint metric) | 🟡 APPROXIMATE | `benches::write_amplification_bench` produces WAF measurements at runtime | 3.04 not captured anywhere in-tree. Bench source explicitly: *"WAF is measured in-process against SimulatedIo (RAM). The absolute numbers are the B-epsilon overhead only — no actual flash writes occur."* — so "3.04" is a simulator measurement, not real-device WAF. |
| **C17** | "Two-region mmap (hot/cold): 15–25 mW idle savings" | ❌ UNVERIFIABLE | (architecture) two-region mmap exists in trustdb-nvm | 15–25 mW range has no source. PASR/LPDDR5X hooks needed to realize idle savings do not exist (see C5). The savings are a model output, not a measurement. |
| **C18** | "Per-thread write coalescer: 8–10× CAS reduction (90% coalesce ratio)" | 🟡 APPROXIMATE | Ring buffer (`store::ring_buffer`) exists; `power_savings_bench.rs` measures app-thread cost ratio | The 8–10× figure is consistent with the bench's stated 103 ns vs 30 µs ring-buffer-vs-sync ratio (~291×), but the **specific** 8–10× claim and 90% coalesce ratio are not in any captured artifact. |
| **C19** | "Adaptive config: 41× scan improvement" | ⚪ EXTERNAL | Adaptive epsilon switching exists (`tree::*`) | This is a *Performance* pillar claim cross-referenced into Efficiency; not audited here. Refer to performance audit. |
| **C20** | "Zero licensing, embedded" | ✅ VERIFIED | `trustdb/Cargo.toml` confirms Rust library / embedded; no SaaS gating; codebase is in the repo | (none) |
| **C21** | "Systems Replaced: 3 (PostGIS + Neo4j + ES)" | 🟡 APPROXIMATE | Spatial (`pointcloud::*`, `pointcloud::spatial_confidence`), graph (multiple modules), search (lens API) all exist as primitives | "Replaces" is a positioning claim; verifying functional parity with PostGIS/Neo4j/Elasticsearch is out of scope for this audit. Architecturally plausible. |
| **C22** | "Serialization Overhead: Zero (in-process)" | ✅ VERIFIED | TrustDB is embedded; no IPC/RPC by default for local reads | (none) |

**Summary count:** ✅ 3 verified · 🟡 4 approximate · ❌ 13 unverifiable · 🔴 1 contradicted · ⚪ 1 external.

---

## 3. JSON Corrections (proposed; do NOT loosen — fix factually)

### 3.1 `scores.json` — `pillars.efficiency`

**Current `powerConsumption` (score 9.8) summary contains 5 unverifiable claims.** Proposed replacement (drops 3,000×, 9.1×, 79/5,200 mW until benches exist; keeps the verified architectural claim):

```diff
 "powerConsumption": {
   "name": "Power Consumption",
-  "score": 9.8,
+  "score": 7.5,
-  "status": "excellent",
+  "status": "strong",
-  "summary": "3,000x NVMe storage energy reduction via LPSR preservation (epoch batching keeps NVMe asleep). 9.1x lower CPU power than SQLite. QoS E-core pinning: 79mW vs 5,200mW P-core. BatteryStateMonitor: adaptive Tier 2 intervals (5ms charging, 500ms low battery, disabled in Low Power Mode). Confidence-weighted persistence: speculative data stays in DRAM only. LPDDR5X PASR via hot/cold mmap separation.",
+  "summary": "BatteryStateMonitor (wikai-core/crates/trustdb-nvm/src/battery_monitor.rs) provides adaptive Tier 2 epoch intervals: 5ms charging, 50ms balanced, 500ms low battery, disabled in Low Power Mode (12 tests). hardware::apple_qos (406 LOC, 8 tests) pins I/O threads to QOS_CLASS_BACKGROUND for E-core scheduling. Architectural design favors low power but published mW numbers (384mW, 157mW, 9.1x vs SQLite) are not captured in any in-tree bench artifact and should not be cited until power_savings_bench is run with a hardware power meter (current bench source documents that 'Power figures are inferred from CPU-time × active-mode current draw, not directly measured').",
   "lastUpdated": "2026-05-13"
 }
```

### 3.2 `scores.json` — `pillars.efficiency.tco`

```diff
 "tco": {
   "name": "Total Cost of Ownership",
-  "score": 9.3,
+  "score": 8.5,
   "status": "excellent",
-  "summary": "Zero licensing, embedded. Governance 49x cheaper than traditional stack. Graviton ARM64 Fargate: 20% cost reduction + 30% perf improvement (deployed). Windows VirtualLock + NUMA allocation for desktop optimization.",
+  "summary": "Zero licensing, embedded Rust library. Replaces typical PostGIS + Neo4j + Elasticsearch stack architecturally; functional-parity audits outstanding. Governance overhead is engine-resident (runtime::governance_instance, 1,121 LOC, 18 tests). Note: 49x cheaper-than-app-layer figure has no captured bench. Graviton ARM64 Fargate not deployed (no deploy workflow uses aarch64/arm64); claim removed pending actual migration. Windows VirtualLock/NUMA not implemented in source; claim removed.",
   "lastUpdated": "2026-05-13"
 }
```

### 3.3 `scores.json` — `pillars.efficiency.resourceUtilization`

```diff
 "resourceUtilization": {
   "name": "Resource Utilization",
-  "score": 9.0,
+  "score": 8.0,
   "status": "excellent",
-  "summary": "B-epsilon tree with adaptive epsilon. NVM two-region mmap (hot/cold) for LPDDR5X PASR bank idling. Adaptive config switching: auto Point-Hot/Scan-Hot based on workload (41x scan improvement). Per-thread write coalescer reduces SoC fabric energy 8-10x. mmap hints: THP for cold region, MADV_RANDOM for hot. Software prefetch on tree traversal. Zone map pruning.",
+  "summary": "B-epsilon tree with adaptive epsilon. NVM two-region mmap (hot/cold) — LPDDR5X PASR bank idling is architectural intent; PASR-specific code not in tree. Adaptive config switching (Point-Hot/Scan-Hot) verified via benches::write_amplification_bench. Per-thread write coalescer (store::ring_buffer) reduces app-thread cost ~291x in power_savings_bench (103ns ring-buffer-append vs 30µs sync commit); the cited 8-10x SoC-fabric figure is unverified. mmap hints + software prefetch implemented in tree traversal code. Zone map pruning is real (encoding::gnse_schemas + intersection ops).",
   "lastUpdated": "2026-05-13"
 }
```

### 3.4 `deep-dives/efficiency.json` — drop or flag specific benchmarks

For **CPU Power (QoS:BACKGROUND) = 384 mW**, **Delta Over Idle = 157 mW**, **NVM Energy Profile = 3,000x**, **Tier 1 dc cvap ~0mW**, **Tier 2 msync ~200mW**: either drop these entirely or add a `"verified": false, "evidence_status": "no captured artifact"` flag on each. The history block citing `2,613 mW`, `437 mW`, `384 mW` from 2026-03-29 should be removed if `MACBOOK-BENCHMARK-HANDOFF.md` (the only cited source) cannot be located.

For **Write Amplification Factor 3.04**: replace `"value": "3.04"` with a verified value captured by re-running `cargo bench --bench write_amplification_bench 2>&1 | grep 'WAF\['` and committing the output to `Research/Benchmarks/waf_results_<date>.md`. The current "3.04 constant across configs" claim is contradicted by the bench design which sweeps batch sizes by design.

For **Bincode 3.3%**: rename to "Codec overhead (bincode wire format)" and either:
(a) re-run a dedicated `codec_overhead_bench.rs` with output captured, or
(b) reword as "the bincode wire codec is used as the baseline serializer; the production codec_pipeline (hybhuff + zstd) layers on top — exact overhead pending dedicated bench."

### 3.5 `features/apple-silicon-qos.json` evidence path correction

The evidence entry `{ "label": "MacBook Benchmark Handoff", "path": "Research/TrustDB/MACBOOK-BENCHMARK-HANDOFF.md" }` points to a file that doesn't exist. Either restore the file or remove the entry. Same applies to `Research/TrustDB/trustdb_final_benchmark_report.md` (cited from 4 different features).

### 3.6 `features/confidence-envelopes.json`, `features/rrms.json` evidence path corrections

```diff
-{ "label": "ConfidenceEnvelope primitive", "path": "trustdb/src/primitives/" },
+{ "label": "ConfidenceEnvelope primitive", "path": "trustdb/src/types/confidence.rs" },

-{ "label": "CABM merge logic", "path": "trustdb/src/merge/" },
+{ "label": "CABM merge logic", "path": "trustdb/src/lockfree/cabm_engine.rs (450 LOC, 13 tests) + trustdb/src/provenance/cabm.rs" },

-{ "label": "RRMS implementation", "path": "trustdb/src/belief/rrms.rs" },
+{ "label": "RRMS implementation", "path": "trustdb/src/rrms/mod.rs (181 LOC) + trustdb/src/rrms/unified_counter.rs (263 LOC, 21 tests)" },

-{ "label": "Access counter sketch", "path": "trustdb/src/primitives/access_counter.rs" },
+{ "label": "Access counter sketch", "path": "trustdb/src/rrms/unified_counter.rs (AccessTracker struct)" },

-{ "label": "Decay function types", "path": "trustdb/src/primitives/decay.rs" },
+{ "label": "Decay function types", "path": "trustdb/src/intelligence/temporal_decay.rs (DecayFunction enum, 652 LOC, 18 tests)" },
```

### 3.7 `benchmarks.json` — flag unverified efficiency entries

Add a `"verified": false` boolean to entries 242, 243, 244 (CPU Power, Delta Over Idle, NVM Storage Energy) and add a `"verification_method": "needs hardware power meter; current bench inferred from CPU-time"` field. The history block for CPU Power should not be published in DoD-facing material until verifiable.

---

## 4. Honest Gaps (per Twin §13)

1. **No `trustdb_final_benchmark_report.md` on disk.** This file is cited as evidence in 4 of 4 features in the Efficiency pillar (apple-silicon-qos, temporal-decay, confidence-envelopes, rrms). It does not exist anywhere under `D:/Digital Fabric/`. Either restore from prior commits or stop citing it.

2. **No `MACBOOK-BENCHMARK-HANDOFF.md` on disk.** This file is the sole source for the 384 mW / 3,995 mW / 9.1× headline figure. It does not exist anywhere on disk. Without it, the headline 9.1× cannot be defended.

3. **No `geo_benchmark_results.json` or `simd_benchmark_results.json` on disk.** Cited as benchmark sources in `benchmarks.json`. Missing.

4. **Power measurements are inferred, not measured.** `power_savings_bench.rs:30` source comment is explicit: *"Power figures are inferred from CPU-time × active-mode current draw (not directly measured)."* The scorecard then publishes the inference as "9.1× lower power." For DoD audience this is the kind of distinction that matters. Fix: either re-run with `powermetrics` capture on real M-series hardware, or label every power figure as "inferred (CPU-time × current draw model)."

5. **Graviton claim is contradicted by deploy config.** Per CLAUDE.md the production stack runs on standard `ca-central-1` Fargate. No deploy workflow uses `aarch64`/`arm64`/`graviton`. The "(deployed)" status is false. Either deploy to Graviton and capture cost/perf delta against the x86_64 baseline, or remove the claim.

6. **Windows desktop optimization claims (VirtualLock, NUMA) are aspirational.** No Win32 calls (`VirtualLock`, `VirtualAllocExNuma`) exist in source. The `numa` mentions in `exec/morsel.rs` and `index/hnsw.rs` are unrelated to Windows desktop. Either implement and capture a Windows-on-NUMA bench, or remove.

7. **LPDDR5X PASR is architectural narrative, not code.** `pasr`/`lpddr`/`lpsr` filter on CodeGraph returns `[]`. No PASR-specific syscalls. The two-region mmap is real, but the "PASR bank idling" inference requires actual measurement on LPDDR5X-equipped hardware, not asserted from the architecture.

8. **TDQP/RRMS nanosecond claims are unmeasured.** The decay math in `intelligence::temporal_decay::apply` is plausibly fast (single `f64::exp`), but no `temporal_decay_bench.rs` exists. The 6.67 ns / 150M evals/sec / 10.3 ns figures are model outputs, not measurements. Build a Criterion bench, commit the result CSV.

9. **WAF 3.04 is from SimulatedIo, not real flash.** `write_amplification_bench.rs:32` is explicit: *"WAF is measured in-process against SimulatedIo (RAM). The absolute numbers are the B-epsilon overhead only — no actual flash writes occur."* The 3.04 transfer to real flash is an inference. Run on real APFS / NTFS / ext4 storage and capture the actual physical-page-write delta to F_FULLFSYNC checkpoints; commit results.

10. **CodeGraph index does not cover `wikai-core/crates/trustdb-nvm/`.** The BatteryStateMonitor (which is the **most verified primitive** of the entire pillar) lives in a crate the main CodeGraph snapshot doesn't index. Surface this gap to CG Master per `feedback_substrate_inventory_check_open_prs.md` doctrine — CodeGraph snapshot stale on critical NVM crates.

11. **Cited evidence paths for ConfidenceEnvelope, CABM, RRMS, decay are all wrong.** Real paths differ from what's cited in feature JSONs. This suggests the feature files were authored before the code reorganized — they were not re-verified at scorecard publication time. Add a Surveys-6/7 step to scorecard publication: every `evidence.path` must `curl /codegraph/api/info?module=X` clean before publication.

---

## 5. Recommended Actions Before DoD Presentation

**P0 — block release until done:**
1. Remove or re-derive the 3,000× / 9.1× / 79 mW / 5,200 mW / 384 mW / 157 mW headline figures. Either re-capture on real hardware with `powermetrics`, or downgrade language ("architectural design supports significantly lower power; quantification pending hardware power-meter run").
2. Remove the Graviton "deployed" claim. It is false today.
3. Remove the Windows VirtualLock/NUMA claim. No code exists.
4. Restore or delete-citation for the 4 missing evidence files.

**P1 — fix before next scorecard update:**
5. Build dedicated benches: `temporal_decay_bench.rs`, `rrms_bench.rs`, `codec_overhead_bench.rs`. Commit Criterion output CSVs to `Research/Benchmarks/<date>/`.
6. Re-run `write_amplification_bench` with real-storage WAF (not SimulatedIo); commit output. Then the 3.04 number (or whatever it turns out to be) can stand.
7. Fix every `evidence.path` in `features/*.json` to point to a CodeGraph-resolvable module.

**P2 — durability:**
8. Add scorecard CI: a script that walks every `evidence.path` and asserts the file or CodeGraph module exists. Fail the build on broken refs.
9. Add a `"verified_via": "<bench_path_or_artifact_path>"` field requirement to every metric in `deep-dives/*.json`. No metric is published without a pointer to the measurement that produced it.
10. Establish the 100%-or-failure calibration discipline for scorecard numbers, the same way the Battery Virtual Lab has it for substrate calibration anchors. A scorecard number with a missing/unverifiable measurement is the same failure mode as a calibration anchor that doesn't pass.

---

## 6. What's Actually Strong (do not remove from the pillar)

The pillar isn't *empty* — there's real engineering underneath. The score should reflect the verified pieces, not the inflated headlines:

- **`hardware::apple_qos`** (406 LOC, 8 tests): real `QOS_CLASS_BACKGROUND` pinning via pthread API. Unique among embedded DBs — SQLite/RocksDB/Realm/Core Data do not pin to E-cores. The architectural advantage is real even without the 9.1× number.
- **`wikai-core/crates/trustdb-nvm/src/battery_monitor.rs`**: `BatteryStateMonitor` with code-resident interval constants (5/50/500 ms + LowPowerMode disabled) — 12 tests. Genuinely novel as a storage-engine primitive.
- **`benches::power_savings_bench`** + **`benches::write_amplification_bench`** (300+288 LOC): the bench harnesses exist, are honest about their methodology in source comments, and are the right primitives — they just need to be run, captured, and committed.
- **`encoding::codec_pipeline`** (612 LOC, 15 tests) + **`encoding::confidence_delta`** + **hybhuff + zstd**: the codec layer is real and substantial.
- **`runtime::governance_instance`** (1,121 LOC, 42 pub_fns, 18 tests): engine-resident governance is real.
- **`intelligence::temporal_decay`** (652 LOC, 18 tests) + **`query::temporal_decay`** (408 LOC, 20 tests): TDQP is real, the math is correct, the Davies decay variant integrates with `intersection::quantum_decay`.
- **`rrms` + `rrms::unified_counter`** (181 + 263 LOC, 21 tests): RRMS is real Hebbian-style reinforcement; the AccessTracker + DecayEntry + ReinforcementSink trait structure is clean.

A score of **7.5–8.0** for the pillar is fully defensible on the architecture alone, **without** any of the disputed headline numbers. The unfortunate effect of publishing unverifiable 9.1×/3,000× claims is that it casts doubt on the very real architectural work underneath them.

---

**End of audit.**
