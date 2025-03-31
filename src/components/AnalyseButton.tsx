"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AnalyseButtonProps {
    onClick?: () => void;
}

const AnalyseButton = ({ onClick }: AnalyseButtonProps) => {
    const [loading, setLoading] = useState(false);
    
    return (
        <Button onClick={onClick} disabled={loading}>
            {loading ? "Analysing..." : "Analyse"}
        </Button>
    );
};

export default AnalyseButton;
