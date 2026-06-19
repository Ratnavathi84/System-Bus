# Security Specification - Smart Transit System

## Data Invariants
1. A user can only access their own profile (with exception for non-PII if needed, but here we'll restrict to owner).
2. Favorites, Saved Routes, and History logs must strictly belong to the user who created them.
3. Users cannot spoof their identity (`userId` in document MUST match `request.auth.uid`).
4. Automated fields like `createdAt` and `updatedAt` must be server-validated.

## The "Dirty Dozen" Payloads (Denial Tests)
1. **Identity Spoofing (Create)**: Create a favorite for another user.
   - Payload: `{ "userId": "victim_uid", "busId": "bus1", "busNumber": "100", "createdAt": request.time }` as `attacker_uid`.
2. **Identity Spoofing (Update)**: Update a favorite's `userId` to someone else.
   - Payload: `{ "userId": "new_uid" }`
3. **Ghost Field Injection**: Add `isAdmin: true` to a user profile.
   - Payload: `{ "displayName": "Attacker", "isAdmin": true, ... }`
4. **Malicious ID Poisoning**: Use a 1MB string as a `favoriteId`.
5. **PII Leak**: Read another user's profile which contains their email.
6. **State Shortcutting**: Create a history log with an invalid interaction type.
   - Payload: `{ "type": "teleport", ... }`
7. **Bypassing Server Timestamps**: Use a client-provided date from 2001 for `createdAt`.
8. **Resource Exhaustion**: Send a `routeName` that is 500KB in size.
9. **Orphaned Write**: Create a favorite with a missing `busId`.
10. **Terminal State Lockdown Bypass**: (Not applicable here yet, but good practice).
11. **Update Immutable Field**: Attempt to change `createdAt` on an existing history log.
12. **Blanket Read Attack**: Attempt to list all users in the system without filtering by UID.

## The Test Runner
A `firestore.rules.test.ts` will be created to verify these denials.
