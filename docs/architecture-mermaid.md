# 4racle Architecture

This diagram is intentionally submission-friendly. It maps to the current implementation without inventing infrastructure that does not exist.

```mermaid
flowchart LR
    subgraph Client["Client"]
        U["Creator"]
        DASH["/dashboard"]
        SCORE["/score/[id]"]
        SEALBTN["Seal button"]
    end

    subgraph API["Next.js API layer"]
        SCOREAPI["POST /api/score"]
        OGAPI["GET /api/og/[id]"]
        SEALAPI["POST /api/seal"]
    end

    subgraph Signals["Live signal providers"]
        GT["Google Trends"]
        SM["Social Momentum"]
        TW["X / CT"]
        RD["Reddit"]
        FM["Four.meme"]
        DX["DexScreener"]
    end

    subgraph Intelligence["Scoring and payload pipeline"]
        OAI["OpenAI scoring"]
        HELPERS["Coverage, evidence, decision, reasons"]
        SIGN["HMAC signer / verifier"]
    end

    subgraph Chain["BNB Chain"]
        HASH["Concept hash"]
        CONTRACT["LaunchScoreRegistry"]
    end

    U --> DASH
    DASH --> SCOREAPI

    SCOREAPI --> GT
    SCOREAPI --> SM
    SCOREAPI --> TW
    SCOREAPI --> RD
    SCOREAPI --> FM
    SCOREAPI --> DX

    GT --> SCOREAPI
    SM --> SCOREAPI
    TW --> SCOREAPI
    RD --> SCOREAPI
    FM --> SCOREAPI
    DX --> SCOREAPI

    SCOREAPI --> OAI
    OAI --> SCOREAPI
    SCOREAPI --> HELPERS
    HELPERS --> SIGN
    SIGN --> SCORE
    SIGN --> OGAPI
    SIGN --> SEALAPI

    SCORE --> SEALBTN
    SEALBTN --> SEALAPI
    OGAPI --> SIGN
    SEALAPI --> SIGN

    SEALAPI --> HASH
    HASH --> CONTRACT
```

## Reading the diagram

- `/api/score` is the private scoring route. It sees the full creator input.
- The public result is converted into a signed payload before it leaves the server.
- `/score/[id]`, `/api/og/[id]`, and `/api/seal` only work from the verified signed payload.
- The seal step hashes the verified public result and builds transaction data for the BNB Chain contract.
