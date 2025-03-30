"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

const AnalyseButton = () => {
    const [loading, setLoading] = useState(false);

    const handleAnalyse = async () => {
        setLoading(true);
        try {
            console.log("Analyzing...");
            // Add your async logic here
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button onClick={handleAnalyse} disabled={loading}>
            {loading ? "Analysing..." : "Analyse"}
        </Button>
    );
};

export default AnalyseButton;
