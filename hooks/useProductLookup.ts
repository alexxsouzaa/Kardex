// hooks/useProductLookup.ts
import { useState } from "react";

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type ExternalProduct = {
    name:     string;
    brand:    string;
    category: string;
    imageUrl: string;
    eanCode:  string;
    source?:  string;
};

type LookupStatus = "idle" | "loading" | "found" | "not_found" | "error";

export type LookupResult = {
    status:  LookupStatus;
    product: ExternalProduct | null;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProductLookup() {
    const [result, setResult] = useState<LookupResult>({ status: "idle", product: null });

    const lookup = async (eanCode: string) => {
        setResult({ status: "loading", product: null });

        try {
            const res  = await fetch(
                `https://world.openfoodfacts.org/api/v0/product/${eanCode}.json`
            );
            const data = await res.json();

            if (data.status === 1 && data.product) {
                const p = data.product;
                setResult({
                    status: "found",
                    product: {
                        eanCode,
                        name:     p.product_name            ?? p.product_name_pt ?? '',
                        brand:    p.brands                   ?? '',
                        category: p.categories_tags?.[0]?.replace('en:', '') ?? '',
                        imageUrl: p.image_front_url          ?? p.image_url       ?? '',
                    },
                });
            } else {
                setResult({ status: "not_found", product: null });
            }
        } catch {
            setResult({ status: "error", product: null });
        }
    };

    const reset = () => setResult({ status: "idle", product: null });

    return { result, lookup, reset };
}