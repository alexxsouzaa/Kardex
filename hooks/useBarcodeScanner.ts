import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useCallback, useState } from "react";
import { STOCK_DATA, StockItem } from "@/constants/stockData";
import { ExternalProduct } from "./useProductLookup";

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type ScanResult =
    | { status: "found";     product: StockItem       }
    | { status: "external";  product: ExternalProduct }
    | { status: "searching"; code: string             }
    | { status: "not_found"; code: string             };

// ─── Helpers de busca ────────────────────────────────────────────────────────

async function searchOpenFoodFacts(code: string): Promise<ExternalProduct | null> {
    try {
        const res  = await fetch(
            `https://world.openfoodfacts.org/api/v0/product/${code}.json`
        );
        const data = await res.json();
        if (data.status !== 1 || !data.product) return null;

        const p = data.product;
        return {
            eanCode:  code,
            name:     p.product_name         ?? p.product_name_pt ?? '',
            brand:    p.brands                ?? '',
            category: p.categories_tags?.[0]?.replace('en:', '') ?? '',
            imageUrl: p.image_front_url       ?? p.image_url       ?? '',
            source:   'Open Food Facts',
        };
    } catch { return null; }
}

async function searchOpenBeautyFacts(code: string): Promise<ExternalProduct | null> {
    try {
        const res  = await fetch(
            `https://world.openbeautyfacts.org/api/v0/product/${code}.json`
        );
        const data = await res.json();
        if (data.status !== 1 || !data.product) return null;

        const p = data.product;
        return {
            eanCode:  code,
            name:     p.product_name         ?? p.product_name_pt ?? '',
            brand:    p.brands                ?? '',
            category: p.categories_tags?.[0]?.replace('en:', '') ?? '',
            imageUrl: p.image_front_url       ?? p.image_url       ?? '',
            source:   'Open Beauty Facts',
        };
    } catch { return null; }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useBarcodeScanner() {
    const [result,  setResult]  = useState<ScanResult | null>(null);
    const [scanned, setScanned] = useState(false);

    const player = useAudioPlayer(
        require("@/assets/sounds/beep.mp3")
    );

    const handleScan = useCallback(async (code: string) => {
        if (scanned) return;
        setScanned(true);

        // ── Feedback ──
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        try { player.seekTo(0); player.play(); } catch {}

        // ── 1. Busca local ──
        const local = STOCK_DATA.find(
            (item) => item.eanCode === code || item.id === code
        );
        if (local) {
            setResult({ status: "found", product: local });
            return;
        }

        // ── 2. Busca externa em cascata ──
        setResult({ status: "searching", code });

        const external =
            await searchOpenFoodFacts(code)   ??
            await searchOpenBeautyFacts(code);

        if (external) {
            setResult({ status: "external", product: external });
        } else {
            setResult({ status: "not_found", code });
        }

    }, [scanned, player]);

    const reset = useCallback(() => {
        setScanned(false);
        setResult(null);
    }, []);

    return { result, scanned, handleScan, reset };
}