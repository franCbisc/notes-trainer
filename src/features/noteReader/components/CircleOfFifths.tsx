/**
 * CircleOfFifths - Circular visual key signature picker with 12 pie-slice quadrants
 */

import React, { FC, useState, useEffect, useRef } from "react";
import {
    CIRCLE_SLICES,
    CIRCLE_RADIUS_OUTER,
    CIRCLE_RADIUS_INNER_COLLAPSED,
    CIRCLE_RADIUS_INNER_EXPANDED,
    CIRCLE_LABEL_RADIUS,
    CIRCLE_START_ANGLE_OFFSET,
} from "../constants";

const KEYS = [
    { key: "Do - Lam", label: "Do", relative: "Lam" },
    { key: "Sol - Mim", label: "Sol", relative: "Mim" },
    { key: "Re - Sim", label: "Re", relative: "Sim" },
    { key: "La - Fa#m", label: "La", relative: "Fa#m" },
    { key: "Mi - Do#m", label: "Mi", relative: "Do#m" },
    { key: "Si - Sol#m", label: "Si", relative: "Sol#m" },
    { key: "Fa# - Re#m", label: "Fa#", relative: "Re#m" },
    { key: "Reb - Sibm", label: "Reb", relative: "Sibm" },
    { key: "Lab - Fam", label: "Lab", relative: "Fam" },
    { key: "Mib - Dom", label: "Mib", relative: "Dom" },
    { key: "Sib - Solm", label: "Sib", relative: "Solm" },
    { key: "Fa - Rem", label: "Fa", relative: "Rem" },
];

interface CircleOfFifthsProps {
    selectedKey: string;
    onKeySelect: (key: string) => void;
}

export const CircleOfFifths: FC<CircleOfFifthsProps> = ({ selectedKey, onKeySelect }) => {
    const [expanded, setExpanded] = useState(false);
    const [hasSelectedKey, setHasSelectedKey] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!expanded) return;
        const handleClickOutside = (e: MouseEvent) => {
            /* istanbul ignore next */
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setExpanded(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [expanded]);

    const handleKeySelect = (key: string) => {
        onKeySelect(key);
        setHasSelectedKey(true);
        setExpanded(false);
    };

    return (
        <div ref={wrapperRef} className={`circleOfFifthsWrapper${expanded ? " expanded" : ""}`}>
        <svg 
            className="circleOfFifths"
            viewBox="0 0 100 100" 
            xmlns="http://www.w3.org/2000/svg"
        >
            {expanded && KEYS.map((k, i) => {
                const startAngle = i * (360 / CIRCLE_SLICES) + CIRCLE_START_ANGLE_OFFSET;
                const endAngle = (i + 1) * (360 / CIRCLE_SLICES) + CIRCLE_START_ANGLE_OFFSET;
                
                const x1 = 50 + CIRCLE_RADIUS_OUTER * Math.cos((startAngle * Math.PI) / 180);
                const y1 = 50 + CIRCLE_RADIUS_OUTER * Math.sin((startAngle * Math.PI) / 180);
                const x2 = 50 + CIRCLE_RADIUS_OUTER * Math.cos((endAngle * Math.PI) / 180);
                const y2 = 50 + CIRCLE_RADIUS_OUTER * Math.sin((endAngle * Math.PI) / 180);
                
                const labelAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180;
                const labelX = 50 + CIRCLE_LABEL_RADIUS * Math.cos(labelAngle);
                const labelY = 50 + CIRCLE_LABEL_RADIUS * Math.sin(labelAngle);
                
                return (
                    <g key={k.key}>
                        <path
                            d={`M 50 50 L ${x1} ${y1} A 45 45 0 0 1 ${x2} ${y2} Z`}
                            className={`circleSlice${selectedKey === k.key ? " circleSliceActive" : ""}`}
                            onClick={() => handleKeySelect(k.key)}
                        />
                        <text
                            x={labelX}
                            y={labelY - 4}
                            className="circleSliceLabel"
                            textAnchor="middle"
                            dominantBaseline="middle"
                        >
                            {k.label}
                        </text>
                        <text
                            x={labelX}
                            y={labelY + 4}
                            className="circleSliceLabel circleSliceRelative"
                            textAnchor="middle"
                            dominantBaseline="middle"
                        >
                            {k.relative}
                        </text>
                    </g>
                );
            })}
            <circle 
                cx="50" 
                cy="50" 
                r={expanded ? CIRCLE_RADIUS_INNER_EXPANDED : CIRCLE_RADIUS_INNER_COLLAPSED} 
                className={`circleCenter${expanded ? " circleCenterExpanded" : ""}`}
                onClick={() => setExpanded(!expanded)}
            />
            <text 
                x="50" 
                y="50" 
                className="circleCenterLabel"
                textAnchor="middle"
                dominantBaseline="middle"
            >
                {expanded ? "" : hasSelectedKey ? selectedKey.split(" - ")[0] : "KEY"}
            </text>
        </svg>
        </div>
    );
};

CircleOfFifths.displayName = "CircleOfFifths";
