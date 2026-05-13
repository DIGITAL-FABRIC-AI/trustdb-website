# Reliability & Integrity Pillar — Code-Grounded Audit

**Auditor:** sub-agent (CodeGraph-grounded, anti-cheat doctrine)
**Date:** 2026-05-13
**Scope:** TrustDB scorecard `pillars.reliability` (4 metrics) + deep-dive + benchmarks + 5 feature files
**Methodology:** CodeGraph REST primary, substrate inventory secondary, raw bench files when present

---

## 1. Executive Summary

**Verified pass rate: ~35%** (7 of ~20 quantified claims verified; the rest are stale, contradicted, or unverifiable from raw evidence).

**Top 3 issues:**

1. **🔴 SSI claim is CONTRADICTED.** `tx::transaction::commit()` performs NO write-set / read-set conflict detection — it just writes the WAL commit and CAS-bumps `committed_root`. This is **Snapshot Isolation, not Serializable Snapshot Isolation**. The repeated "Serializable (SSI)" claim across `scores.json`, `reliability.json`, `cow-mvcc.json`, and `benchmarks.json` (Neo4j matchup) is unsupported by code. CodeGraph filters `ssi`, `serializable`, `mvcc` all return zero modules. The cow-mvcc feature file cites `trustdb/src/txn/ssi.rs` which does not exist.

2. **🔴 Raft module/LOC/test counts are STALE — undercounted.** Claimed "13 modules, 4,896 LOC, 106 tests". Actual via CodeGraph (sum over `replication::*` excluding bench): **16 modules, 7,278 LOC, 117 tests**. The deep-dive omits `replication::commit_certificate` (659 LOC, 13 tests), `replication::raft_orchestrator` (580 LOC, 9 tests), `replication::peer_mesh_transport_rpc` (683 LOC, 2 tests), and the empty `replication::mod` (64 LOC). It also lists `typed_entry.rs` at 458 LOC; real value is 473.

3. **❌ "10,000 DST crash sequences" and "214 NVM tests" are UNVERIFIABLE.** `tests::dst_crash_test` has only **2 test functions** at the Rust `#[test]` level; the "10,000" must be runtime parameterized inside, but no raw evidence file (`TEST_RESULTS.md`, gym-results/dst_*.json) exists on disk. The "214 NVM tests" claim cannot be reconciled with code: `storage::nvm_io` (8) + `storage::nvme_detect` (4) = **12 NVM tests total**. There is no other module matching `nvm` in CodeGraph. The figure is off by ~18×.

**Other notable issues:**
- "33 WAL tests" — narrow wal::* sums to **49**, claimed breakdown (9+14+8+2) sums to 33 but `wal::wal` actually has 17 tests (not 14), so the breakdown is internally stale.
- "CRC32c checksums on pages" — no `crc32`, `crc`, `checksum` module exists in CodeGraph. Likely real but unverified at the module-discovery level.
- Feature file `wal-group-commit.json` says **FNV32 checksums**; scores.json says **HMAC-SHA384 chained**. The HMAC-SHA384 claim is verified in `wal::hmac` (439 LOC, 9 tests), so wal-group-commit.json is stale.
- Cited evidence paths frequently point at files that do not exist: `trustdb/src/txn/ssi.rs`, `trustdb/src/wal/checksum.rs`, `trustdb/src/wal/group_commit.rs` (real: `src/store/wal_group_commit.rs`), `trustdb/TEST_RESULTS.md`, `trustdb/src/gc/epoch_guard.rs` (real: `src/concurrency/epoch_guard.rs`), `trustdb/src/cascade/` (real: exists but at `src/cascade/`, not in `trustdb/`).

---

## 2. Per-Claim Verdict Table

| # | Claim (quote) | Source | Evidence (CodeGraph) | Verdict | Update |
|---|---|---|---|---|---|
| 1 | "Raft consensus — 13 modules, 4,896 LOC, 106 tests" | scores.json::availability, deep-dive::availability, scalability::horizontalVertical, byCompetitor::Neo4j, byTimeline 2026-04-02 | `?filter=replication` → **16 modules, 7,278 LOC, 117 tests** (excl. benches::replication_bench). Missing from claim: `replication::commit_certificate` (659/13), `replication::raft_orchestrator` (580/9), `replication::peer_mesh_transport_rpc` (683/2). Deep-dive also lists `typed_entry` at 458 LOC (actual: 473). | 🔴 CONTRADICTED (stale undercount) | Update to "16 modules, 7,278 LOC, 117 tests" everywhere |
| 2 | "Serializable snapshot isolation (SSI). All reads return consistent committed state." | scores.json::consistency, deep-dive::consistency, cow-mvcc.json step 3, benchmarks.json Neo4j matchup, byOperation Concurrency block | `tx::transaction::commit()` body (lines 558-572) does NO conflict detection — just `wal.commit()` + atomic store of `committed_root`. No `ssi`, `serializable`, `mvcc` modules in CodeGraph. `cow-mvcc.json` cites non-existent `src/txn/ssi.rs`. Real path is `tx::transaction` (snapshot-acquired via `begin_read_at`). | 🔴 CONTRADICTED | Downgrade to "Snapshot Isolation (CoW MVCC). Score: 7.5" |
| 3 | "WAL HMAC-SHA384 chained (PR #247)" + "[0xCB magic][provenance:26B][record:N][hmac_tag:48B]" + "each tag covers prev_tag + WalProvenance + data" | scores.json::durability/faultTolerance, deep-dive::durability, benchmarks.json Governance & Security | `wal::hmac` info: pub fns include `compute_chained_hmac(key, prev_tag, provenance, data)`, `encode_chained_record`, `verify_chained_hmac`, `verify_wal_chain` returning `WalAuditResult { records_verified, records_valid, first_invalid_index, chain_intact, provenance_trail }`. `WalProvenance` fields: `agent_id`, `clearance: u8`, `connectivity`, `write_ts_ms: u64`. fan_in=4 (wal::wal, tx::transaction, tx::partitioned_tx, compliance::export). | ✅ VERIFIED | No change |
| 4 | "33 WAL tests total (9 HMAC, 14 WAL, 8 epoch WAL, 2 partitioned WAL)" | deep-dive::durability, faultTolerance | Real: HMAC=9 ✓, wal::wal=**17** (not 14), epoch_wal=8 ✓, partitioned_wal=2 ✓. Sum = **36**, not 33. Plus wal::signing(9) + wal::partition_bridge(4) → narrow wal::* = **49**. Broader (incl. storage::aligned_wal=10, store::wal_group_commit=5, tests::wal_test=5) = **69**. | 🟡 APPROXIMATE (stale) | "49 narrow WAL tests (9 HMAC, 17 WAL, 8 epoch, 4 partition_bridge, 9 signing, 2 partitioned)" |
| 5 | "10,000 DST crash sequences" + "1,000 WAL recovery sequences" + "0 failures" | scores.json::durability/faultTolerance, deep-dive::durability, benchmarks.json byOperation Durability & Recovery | `tests::dst_crash_test` exists with **test_count=2** (parameterized within); deps: `store::TrustDbStore`, `wal::recover_from_entries`, `wal::WalRecord`. Module is real, sequence count is parameter. No raw benchmark file on disk: `wikai-core/gym-results/` has only 8 files, none labeled dst/recovery. `trustdb/TEST_RESULTS.md` does not exist. | ❌ UNVERIFIABLE (sequence count not exposed in code-graph or raw evidence) | Either add `gym-results/dst_crash_10k.json` evidence, or scope claim to "2 DST suites (parameterized to 10K sequences in test config)" |
| 6 | "NVM crash recovery tests (214 NVM tests total)" | scores.json::durability | `?filter=nvm` → only `storage::nvm_io` (8 tests) + `storage::nvme_detect` (4 tests) = **12 tests**. `?filter=nvme` → only `storage::nvme_detect`. No other module matches `nvm`. | 🔴 CONTRADICTED (~18× overcount) | Replace "214 NVM tests" with "12 NVM tests (8 nvm_io + 4 nvme_detect)" |
| 7 | "EpochGuard + EpochTable for safe reclamation" | scores.json::concurrency, benchmarks.json Concurrency, cow-mvcc step 4 | `concurrency::epoch_guard` (212 LOC, 9 pub fns, 5 tests) + `concurrency::epoch_table` (127 LOC, 6 pub fns, 3 tests) both confirmed. tx::transaction takes `Arc<EpochGuard>`. | ✅ VERIFIED | No change |
| 8 | "CRC32c checksums on pages" | scores.json::faultTolerance, deep-dive::faultTolerance benchmark "Data Checksums + WAL HMAC" | CodeGraph `?filter=crc`, `?filter=crc32`, `?filter=checksum` all return **empty**. Likely implemented inline in storage/page modules but not visible at module-discovery level. No way to confirm from code-graph alone. | ❌ UNVERIFIABLE | Either cite the specific function (e.g., grep page-write path) or soften to "page integrity verification". Keep claim contingent on grep evidence. |
| 9 | "Per-record HMAC-SHA384 provenance" | byTimeline 2026-04-02 MVCC Model | `wal::hmac::compute_chained_hmac` takes `provenance: &WalProvenance` per record. `wal::signing` (270 LOC, 9 tests) handles signing pathway. | ✅ VERIFIED | No change |
| 10 | "Conflict Resolution Pipeline: PREFIX_CONFLICT_QUEUE + PREFIX_SNAPSHOT + PREFIX_PROVISIONAL, 26 sync_ops tests" | deep-dive::availability | `concurrency::conflict_graph` (431 LOC, 5 tests) exists; sync_ops module not exposed in inventory (referenced in evidence as `src/store/sync_ops.rs (959 LOC)` but not in CodeGraph filter results). PREFIX codes are runtime constants, not modules. | 🟡 APPROXIMATE | Cite `concurrency::conflict_graph` directly; sync_ops test count requires raw module info |
| 11 | "Self-governing topology (WN-RAFT2-04) ... 8 tests" | scores.json::availability, deep-dive::availability | `replication::topology_governor` (357 LOC, 9 pub fns, 3 pub structs, **8 tests**). ✓ | ✅ VERIFIED | No change |
| 12 | "State-as-Intelligence Publisher (WN-RAFT2-07) ... 4 tests" | scores.json::availability, deep-dive::availability | `replication::state_publisher` (330 LOC, 9 pub fns, 5 pub structs, **4 tests**). ✓ | ✅ VERIFIED | No change |
| 13 | "Entry dedup (WN-RAFT2-02, 3 strategies) — 15 tests" | scores.json::availability, deep-dive::availability | `replication::entry_dedup` (732 LOC, 1 pub fn, 3 pub structs, **15 tests**). ✓ | ✅ VERIFIED | No change |
| 14 | "Device lifecycle: 22 device tests across 3 modules" | scores.json::availability, scores.json::elasticity, deep-dive::availability | Deep-dive evidence lists `device_registry.rs (491 LOC, 9 tests)`, `device_manifest.rs (304 LOC, 7 tests)`, `device_connection.rs (358 LOC, 6 tests)` → sum=22. Not exposed in `?filter=device` (filter searches didn't return; these are store::* sub-modules). Plausibly verified by file existence but not surfaced in current inventory snapshot. | 🟡 APPROXIMATE | Confirm via direct CodeGraph info call to those three modules; if confirmed update to ✅ |
| 15 | "13/13 DB-Gym pass" + "Resilience Test Suite" | scores.json::faultTolerance, deep-dive::faultTolerance, benchmarks.json | No raw gym result file labeled "resilience" exists in `wikai-core/gym-results/` (only 8 files: batch_write_10, entity_lifecycle_1k, paper_benchmark, point_read_uniform, point_write_no_confidence, point_write_with_confidence_json, search_cwbm25_100, zone_map_benchmark). No `report.md` summary section visible covering 13 resilience scenarios. | ❌ UNVERIFIABLE | Either commit `gym-results/resilience_suite.json` or scope claim |
| 16 | "Auto WAL Recovery: Active" | scores.json::faultTolerance, deep-dive::faultTolerance | `wal::wal::recover_from_entries` exists (referenced by tests::dst_crash_test internal deps). `wal::wal` has 17 tests including recovery paths. | ✅ VERIFIED | No change |
| 17 | "Transitive Invalidation Cascade: Automatic (stale_indices)" | scores.json::faultTolerance, deep-dive::faultTolerance | `cascade::boundary_cascade` (220 LOC, 5 tests) + `cascade` mod (144 LOC, 0 tests) + `store::cascade_ops` (197 LOC, 5 tests) + `tests::cascade_test` (93 LOC, 8 tests). 18 cascade tests total. Module exists; `stale_indices` specific symbol not surfaced but cascade machinery is real. | ✅ VERIFIED | Optionally cite test count |
| 18 | "Group commit ... FNV32 checksums" | wal-group-commit.json | Internal contradiction with scores.json/deep-dive which claim HMAC-SHA384 chained as of PR #247. Real implementation per `wal::hmac` is HMAC-SHA384 chained, not FNV32. Feature file is stale (pre-PR #247). | 🔴 CONTRADICTED (own scorecard) | Rewrite wal-group-commit.json step 3 to "HMAC-SHA384 chained tag (PR #247)" and update evidence paths |
| 19 | "Group Commit Improvement: 8-10x throughput vs per-write fsync" | wal-group-commit.json | `store::wal_group_commit` (369 LOC, 18 pub fns, 5 tests) exists. No raw benchmark file showing the 8-10x figure on disk. | ❌ UNVERIFIABLE (no raw bench file cited) | Cite a specific benchmark run, or soften |
| 20 | Cited evidence paths (cow-mvcc, wal-group-commit, conflict-resolution, provenance-chains) | 4 feature JSONs | All cite paths that don't match actual repo layout: `trustdb/src/txn/ssi.rs` (no `txn`, actual is `tx`), `trustdb/src/wal/checksum.rs` (no such file), `trustdb/src/wal/group_commit.rs` (real path: `src/store/wal_group_commit.rs`), `trustdb/src/gc/epoch_guard.rs` (real: `src/concurrency/epoch_guard.rs`), `trustdb/src/federation/conflict_classify.rs` (no `federation` namespace in CodeGraph), `trustdb/src/index/tci.rs` (no `index::tci` in CodeGraph). | 🔴 CONTRADICTED | Refresh all evidence paths to actual `src/<real-module>.rs` |
| 21 | "Provenance Chain ... ProvenanceChain on every entity (zero overhead)" | provenance-chains.json, scores.json::auditing | `?filter=provenance` returns 27 modules. `primitives::provenance` referenced in wal::hmac internal_deps. Real. | ✅ VERIFIED | Update evidence path |
| 22 | "Background Sync Worker — tokio::spawn, 3 tokio tests" | deep-dive::availability | Not exposed in current inventory's standard filters; likely real in `src/background_sync.rs` but not in CodeGraph filter snapshots provided. | 🟡 APPROXIMATE | Confirm via direct CodeGraph info call |
| 23 | "5 structural invariants enforced" | deep-dive::consistency | `?filter=invariant` returns 30+ modules but all in substrate-physics / smart_edge / governance space, NOT in tx/storage. No "5 storage invariants" identifiable. | ❌ UNVERIFIABLE | Either enumerate specific invariants with tests, or remove |
| 24 | "Encryption WAF (with full stack) = 3.03" | benchmarks.json Governance & Security | Cited source `db-gym` but no `encryption_waf.json` in gym-results/. | ❌ UNVERIFIABLE | Surface raw bench file or scope claim |
| 25 | "DB-Gym Resilience 13/13 pass" | deep-dive::faultTolerance, benchmarks.json | Same as #15 — no raw file on disk. | ❌ UNVERIFIABLE | (see #15) |

---

## 3. Proposed Corrected JSON Snippets

### 3.1 `scores.json` — pillars.reliability

```json
{
  "reliability": {
    "name": "Reliability & Integrity",
    "subtitle": "The Trust Pillar",
    "icon": "shield",
    "overallScore": 8.7,
    "metrics": {
      "durability": {
        "name": "Durability",
        "score": 9.0,
        "status": "excellent",
        "summary": "Dual persistence: WAL (group commit via store::wal_group_commit, 369 LOC + 5 tests; CoW pages) + NVM persistence (storage::nvm_io 296 LOC + 8 tests, storage::nvme_detect 260 LOC + 4 tests = 12 NVM tests). Platform fences described in code. EpochWalWriter via wal::epoch_wal (281 LOC, 8 tests). DST crash testing: tests::dst_crash_test (parameterized — raw sequence count to be re-evidenced in gym-results/). 49 narrow WAL tests (wal::wal 17 + wal::hmac 9 + wal::signing 9 + wal::epoch_wal 8 + wal::partition_bridge 4 + wal::partitioned_wal 2).",
        "lastUpdated": "2026-05-13"
      },
      "consistency": {
        "name": "Consistency",
        "score": 7.5,
        "status": "strong",
        "summary": "Snapshot Isolation (SI) via CoW MVCC — readers acquire snapshot at begin_read; writers create new pages without blocking. Single write_lock Mutex serializes writers within a partition. Note: tx::transaction::commit() does NOT perform write-set/read-set conflict detection — this is SI, not Serializable SI (SSI). Multi-partition concurrency via tx::partitioned_tx (339 LOC, 6 tests).",
        "lastUpdated": "2026-05-13"
      },
      "availability": {
        "name": "Availability",
        "score": 9.0,
        "status": "excellent",
        "summary": "Raft consensus — 16 modules, 7,278 LOC, 117 tests (filter=replication via CodeGraph). Core: leader election (replication::raft 432/8), node (647/10), snapshot (215/4), persistence (210/6), rpc (340/0), engine (451/3). Advanced: topology governor (357/8, WN-RAFT2-04 auto-demotion/promotion), state publisher (330/4, WN-RAFT2-07), entry dedup (732/15, 3 strategies), chain group (536/10), commit certificate (659/13), expected composition (569/13), typed entry (473/12), raft orchestrator (580/9), peer mesh transport rpc (683/2). Device lifecycle and conflict resolution wired. ",
        "lastUpdated": "2026-05-13"
      },
      "faultTolerance": {
        "name": "Fault Tolerance",
        "score": 9.0,
        "status": "excellent",
        "summary": "Auto WAL recovery (wal::wal::recover_from_entries, 17 tests). HMAC-SHA384 chained WAL (PR #247) via wal::hmac (439 LOC, 9 tests): compute_chained_hmac + verify_wal_chain produce WalAuditResult{records_verified, records_valid, chain_intact, provenance_trail}. fan_in=4 (wal::wal, tx::transaction, tx::partitioned_tx, compliance::export). Cascade invalidation: cascade::boundary_cascade (220/5) + store::cascade_ops (197/5) + tests::cascade_test (8 tests). NOTE: 'CRC32c checksums on pages' and '13/13 DB-Gym resilience pass' claims pending raw evidence.",
        "lastUpdated": "2026-05-13"
      }
    }
  }
}
```

### 3.2 `deep-dives/reliability.json` — consistency.benchmarks (corrected)

```json
{
  "metric": "consistency",
  "metricName": "Consistency",
  "score": 7.5,
  "status": "strong",
  "benchmarks": [
    {
      "name": "Isolation Level",
      "value": "Snapshot Isolation (CoW MVCC) — NOT Serializable",
      "target": "Documented isolation level",
      "met": true,
      "source": "tx::transaction (980 LOC, 14 tests). commit() body: writes WAL commit record + atomic Release store of committed_root. No write-set/read-set conflict detection. Multi-writer concurrency via tx::partitioned_tx (339 LOC, 6 tests, 17 pub fns) + tx::partitioned_lock (209 LOC, 5 tests).",
      "comparisons": [
        { "system": "SQLite", "value": "Serializable" },
        { "system": "RocksDB", "value": "Snapshot Isolation" },
        { "system": "Neo4j", "value": "Read Committed" },
        { "system": "PostgreSQL", "value": "Serializable (optional)" }
      ]
    }
  ]
}
```

### 3.3 `features/cow-mvcc.json` — corrected evidence + step 3

```json
{
  "howItWorks": [
    { "step": "3", "title": "Snapshot Isolation (NOT Serializable)",
      "description": "Each WriteTx holds a single MutexGuard serializing partition writers. Reads use begin_read_at(snapshot) returning a ReadTx tied to a frozen root PageId. Commits perform NO write-set/read-set conflict detection — SI semantics only. SSI (write-set tracking + abort on dangerous structure) is not implemented." }
  ],
  "evidence": [
    { "label": "Transaction manager", "path": "wikai-core/crates/trustdb/src/tx/transaction.rs" },
    { "label": "Partitioned transactions", "path": "wikai-core/crates/trustdb/src/tx/partitioned_tx.rs" },
    { "label": "EpochGuard reclamation", "path": "wikai-core/crates/trustdb/src/concurrency/epoch_guard.rs" },
    { "label": "EpochTable", "path": "wikai-core/crates/trustdb/src/concurrency/epoch_table.rs" }
  ]
}
```

### 3.4 `features/wal-group-commit.json` — corrected step 3 + evidence

```json
{
  "howItWorks": [
    { "step": "3", "title": "HMAC-SHA384 Chained Tag (PR #247)",
      "description": "Each WAL record carries a 48-byte HMAC-SHA384 tag computed via wal::hmac::compute_chained_hmac(key, prev_tag, provenance, data). prev_tag chains tampering detection across records. wal::hmac::verify_wal_chain returns WalAuditResult{records_verified, records_valid, first_invalid_index, chain_intact, provenance_trail}. RDKC-derived or static keys via WalKeyProvider enum." }
  ],
  "evidence": [
    { "label": "WAL writer", "path": "wikai-core/crates/trustdb/src/wal/wal.rs" },
    { "label": "Group commit", "path": "wikai-core/crates/trustdb/src/store/wal_group_commit.rs" },
    { "label": "HMAC chain", "path": "wikai-core/crates/trustdb/src/wal/hmac.rs" },
    { "label": "WAL signing", "path": "wikai-core/crates/trustdb/src/wal/signing.rs" }
  ]
}
```

### 3.5 `benchmarks.json` — Durability & Recovery group

```json
{
  "name": "Durability & Recovery",
  "icon": "hard-drive",
  "benchmarks": [
    { "name": "DST Crash Recovery (tests::dst_crash_test)", "value": "2 parameterized test functions (sequence count = runtime parameter, raw count pending evidence file)", "source": "db-gym", "pillar": "reliability", "comparisons": [{"system": "SQLite", "value": "Decades production"}, {"system": "RocksDB", "value": "Meta crash-safe"}], "verdict": "Code-resident DST machinery confirmed. Sequence-count claim ('10K sequences') requires raw evidence at gym-results/dst_crash_*.json." },
    { "name": "WAL Recovery (wal::wal::recover_from_entries)", "value": "17 wal::wal tests, recovery path confirmed in CodeGraph", "source": "db-gym", "pillar": "reliability", "verdict": "Recovery code path verified. Sequence-count claim requires raw evidence file." },
    { "name": "DB-Gym Resilience Suite", "value": "PENDING raw evidence — 13/13 claim has no matching gym-results file", "source": "db-gym", "pillar": "reliability", "verdict": "Either commit gym-results/resilience_suite.json or rescope claim." }
  ]
}
```

### 3.6 `benchmarks.json` — byCompetitor Neo4j (correct Isolation row)

```json
{ "dimension": "Isolation Level", "trustdb": "Snapshot Isolation (CoW MVCC)", "competitor": "Read Committed", "winner": "trustdb", "note": "TrustDB SI > Neo4j RC, but TrustDB is NOT Serializable SSI as previously claimed." }
```

---

## 4. Honest Gaps

| Gap | Action required |
|---|---|
| SSI was claimed but only SI is implemented | Either build SSI conflict-detection at commit time, or update all docs to "Snapshot Isolation". Recommended: update docs; SSI is a substantial engineering investment. |
| "10,000 DST crash sequences" has no raw file | Re-run dst_crash_test with logging and commit `gym-results/dst_crash_10k_2026-05.json`. |
| "214 NVM tests" is off by 17.8× from CodeGraph | Either point to specific test files not yet in CodeGraph (e.g., integration tests in `tests/nvm_*.rs`), or correct to 12. |
| "CRC32c checksums" not surfaced in CodeGraph | Either grep for `crc32c\|Crc32c\|CRC32C` in `src/storage/` and cite specific function, or remove. |
| `trustdb/TEST_RESULTS.md` is cited but missing | Generate from latest CI run or remove evidence pointer. |
| 7+ feature-file evidence paths are stale (`txn/ssi.rs`, `gc/epoch_guard.rs`, `wal/checksum.rs`, `wal/group_commit.rs`, `federation/conflict_classify.rs`, `index/tci.rs`) | Refresh against CodeGraph: real paths are `tx/transaction.rs`, `concurrency/epoch_guard.rs`, `wal/hmac.rs`, `store/wal_group_commit.rs`, etc. |
| `wal-group-commit.json` says FNV32 but the actual checksum mechanism (per PR #247) is HMAC-SHA384 chained | Update feature file step 3 + evidence (snippet 3.4 above). |
| Raft module/LOC/test counts stale across 5+ JSON files | Single bulk replace: 13→16, 4,896→7,278, 106→117. Add missing modules to deep-dive evidence list (commit_certificate, raft_orchestrator, peer_mesh_transport_rpc). |
| `replication::peer_mesh_transport_rpc` has only 2 tests for 683 LOC | Honest gap: large module, low test density. Either expand tests or surface as known gap. |
| `replication::rpc` (340 LOC) has **0 tests** | Honest gap. |
| "DB-Gym Resilience 13/13" with no raw file | Generate or rescope. |
| Score inflation: overallScore=9.5 with SSI contradicted + 18× NVM overcount + missing raw evidence for 3+ headline claims | Recommend overallScore=8.7 (consistency 7.5, durability 9.0, availability 9.0, faultTolerance 9.0). |

---

## 5. Score-Adjustment Recommendation

| Metric | Current | Recommended | Rationale |
|---|---|---|---|
| Durability | 9.5 | **9.0** | Strong WAL HMAC chain + NVM persistence verified; 214→12 NVM test overcount; sequence-count claims pending raw evidence |
| Consistency | 9.0 | **7.5** | Real isolation is SI, not SSI; downgrade is mandatory given anti-cheat doctrine |
| Availability | 9.0 | **9.0 (hold)** | Raft is actually larger (117 vs 106 tests) — count fix is upward; score unchanged |
| Fault Tolerance | 9.7 | **9.0** | HMAC chain verified; CRC32c unconfirmed; 13/13 DB-Gym unverifiable |
| **Overall** | **9.5** | **8.7** | Weighted average; reflects honest-gaps doctrine |

Anti-cheat compliance: no tolerance widening, no test removal. Where a claim is unsupported, it is downgraded to APPROXIMATE or UNVERIFIABLE rather than excised. Where a claim is contradicted by code (SSI), the score is reduced — not the test.
