# Graph Report - /run/media/abhishek/BBC/repos/github-d  (2026-04-24)

## Corpus Check
- 28 files · ~15,802 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 63 nodes · 48 edges · 27 communities detected
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]

## God Nodes (most connected - your core abstractions)
1. `handleBulkAction()` - 6 edges
2. `getOctokit()` - 6 edges
3. `handleDelete()` - 3 edges
4. `deleteRepo()` - 3 edges
5. `handleMakePrivate()` - 2 edges
6. `handleMakePublic()` - 2 edges
7. `handleArchive()` - 2 edges
8. `handleUnarchive()` - 2 edges
9. `handleDownloadZip()` - 2 edges
10. `fetchAllRepos()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `handleDelete()` --calls--> `deleteRepo()`  [INFERRED]
  /run/media/abhishek/BBC/repos/github-d/src/components/layout/ActionBar.tsx → /run/media/abhishek/BBC/repos/github-d/src/lib/github.ts
- `handleDelete()` --calls--> `backupRepoToTelegram()`  [INFERRED]
  /run/media/abhishek/BBC/repos/github-d/src/components/layout/ActionBar.tsx → /run/media/abhishek/BBC/repos/github-d/src/lib/telegram.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.43
Nodes (6): deleteRepo(), downloadRepoZip(), fetchAllRepos(), getOctokit(), updateRepoArchived(), updateRepoVisibility()

### Community 1 - "Community 1"
Cohesion: 0.52
Nodes (6): handleArchive(), handleBulkAction(), handleDownloadZip(), handleMakePrivate(), handleMakePublic(), handleUnarchive()

### Community 2 - "Community 2"
Cohesion: 0.4
Nodes (0): 

### Community 3 - "Community 3"
Cohesion: 0.5
Nodes (0): 

### Community 4 - "Community 4"
Cohesion: 0.5
Nodes (2): handleDelete(), backupRepoToTelegram()

### Community 5 - "Community 5"
Cohesion: 0.67
Nodes (0): 

### Community 6 - "Community 6"
Cohesion: 0.67
Nodes (0): 

### Community 7 - "Community 7"
Cohesion: 1.0
Nodes (0): 

### Community 8 - "Community 8"
Cohesion: 1.0
Nodes (0): 

### Community 9 - "Community 9"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Community 12"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Community 13"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 7`** (2 nodes): `Dashboard()`, `Dashboard.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (2 nodes): `OAuthCallback()`, `OAuthCallback.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (2 nodes): `TelegramSetupBanner.tsx`, `handleDismiss()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (2 nodes): `GithubIcon()`, `GithubIcon.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (2 nodes): `handleSelectAll()`, `RepoList.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (2 nodes): `loginWithGitHub()`, `auth.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (2 nodes): `utils.ts`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (2 nodes): `handler()`, `auth.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (2 nodes): `telegram.js`, `handler()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (1 nodes): `postcss.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (1 nodes): `tailwind.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (1 nodes): `eslint.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (1 nodes): `Login.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (1 nodes): `AppShell.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (1 nodes): `Checkbox.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (1 nodes): `Button.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (1 nodes): `FilterBar.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (1 nodes): `repoStore.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `selectionStore.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (1 nodes): `authStore.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `handleDelete()` connect `Community 4` to `Community 0`, `Community 1`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `deleteRepo()` connect `Community 0` to `Community 4`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `handleDelete()` (e.g. with `backupRepoToTelegram()` and `deleteRepo()`) actually correct?**
  _`handleDelete()` has 2 INFERRED edges - model-reasoned connections that need verification._