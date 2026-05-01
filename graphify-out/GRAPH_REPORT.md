# Graph Report - /run/media/abhishek/BBC/repos/github-d  (2026-05-02)

## Corpus Check
- 32 files · ~20,814 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 82 nodes · 77 edges · 30 communities detected
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]

## God Nodes (most connected - your core abstractions)
1. `getOctokit()` - 11 edges
2. `handleBulkAction()` - 5 edges
3. `backupRepoToTelegram()` - 5 edges
4. `handleAction()` - 4 edges
5. `loadInvites()` - 3 edges
6. `handleDownloadZip()` - 3 edges
7. `handleDelete()` - 3 edges
8. `handleLeave()` - 3 edges
9. `handleTransfer()` - 3 edges
10. `listInvitations()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `loadInvites()` --calls--> `listInvitations()`  [INFERRED]
  /run/media/abhishek/BBC/repos/github-d/src/components/layout/NotificationBell.tsx → /run/media/abhishek/BBC/repos/github-d/src/lib/github.ts
- `handleAction()` --calls--> `acceptInvitation()`  [INFERRED]
  /run/media/abhishek/BBC/repos/github-d/src/components/layout/NotificationBell.tsx → /run/media/abhishek/BBC/repos/github-d/src/lib/github.ts
- `handleAction()` --calls--> `declineInvitation()`  [INFERRED]
  /run/media/abhishek/BBC/repos/github-d/src/components/layout/NotificationBell.tsx → /run/media/abhishek/BBC/repos/github-d/src/lib/github.ts
- `handleDelete()` --calls--> `deleteRepo()`  [INFERRED]
  /run/media/abhishek/BBC/repos/github-d/src/components/layout/ActionBar.tsx → /run/media/abhishek/BBC/repos/github-d/src/lib/github.ts
- `handleLeave()` --calls--> `leaveRepo()`  [INFERRED]
  /run/media/abhishek/BBC/repos/github-d/src/components/layout/ActionBar.tsx → /run/media/abhishek/BBC/repos/github-d/src/lib/github.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.22
Nodes (11): handleArchive(), handleBulkAction(), handleDelete(), handleDownloadZip(), handleLeave(), handleMakePrivate(), handleMakePublic(), handleTransfer() (+3 more)

### Community 1 - "Community 1"
Cohesion: 0.28
Nodes (11): acceptInvitation(), declineInvitation(), deleteRepo(), fetchAllRepos(), getOctokit(), leaveRepo(), listInvitations(), searchUsers() (+3 more)

### Community 2 - "Community 2"
Cohesion: 0.4
Nodes (0): 

### Community 3 - "Community 3"
Cohesion: 0.4
Nodes (0): 

### Community 4 - "Community 4"
Cohesion: 0.67
Nodes (2): handleAction(), loadInvites()

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

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 7`** (2 nodes): `Dashboard()`, `Dashboard.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (2 nodes): `OAuthCallback()`, `OAuthCallback.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (2 nodes): `handleClose()`, `LeaveModal.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (2 nodes): `TelegramSetupBanner.tsx`, `handleDismiss()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (2 nodes): `TransferModal.tsx`, `handleClose()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (2 nodes): `GithubIcon()`, `GithubIcon.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (2 nodes): `handleSelectAll()`, `RepoList.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (2 nodes): `loginWithGitHub()`, `auth.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (2 nodes): `utils.ts`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (2 nodes): `handler()`, `auth.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (2 nodes): `telegram.js`, `handler()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (2 nodes): `handler()`, `download.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (1 nodes): `postcss.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (1 nodes): `tailwind.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (1 nodes): `eslint.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (1 nodes): `Login.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (1 nodes): `AppShell.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (1 nodes): `Checkbox.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `Button.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (1 nodes): `FilterBar.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (1 nodes): `repoStore.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (1 nodes): `selectionStore.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (1 nodes): `authStore.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `transferRepo()` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `backupRepoToTelegram()` (e.g. with `handleDownloadZip()` and `handleDelete()`) actually correct?**
  _`backupRepoToTelegram()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `handleAction()` (e.g. with `acceptInvitation()` and `declineInvitation()`) actually correct?**
  _`handleAction()` has 2 INFERRED edges - model-reasoned connections that need verification._