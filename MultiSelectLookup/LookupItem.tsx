import * as React from 'react';
import { useState } from 'react';
import { IInputs } from './generated/ManifestTypes';
import { ExtendedUtils, ExtendedContext, ExecuteRequest, ExtendedWebApi, ILookupRecord } from './types';
import { Link } from '@fluentui/react';
import { ILookupProps } from './types';

export const LookupItem = () => {
    const [hovered, setHovered] = useState(false);
    return (
        <div style={{
            display: 'inline-flex',
            flexDirection: 'row',
            padding: '4px',
            borderRadius: '5px',
            backgroundColor: hovered ? 'rgb(189, 219, 253)' : 'rgb(217, 234, 253)',
            width: 'fit-content',
            maxWidth: "200px",
            alignItems: 'center',
            color: 'rgb(17, 94, 163)',
            boxShadow: hovered
                ? '0 4px 6px rgba(0, 0, 0, 0.1)'
                : '0 2px 4px rgba(0, 0, 0, 0.05)',
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
            userSelect: 'none'
        }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                flexGrow: 1,
                overflow: 'hidden',
            }}>
                <img
                    style={{
                        color: "rgb(17, 94, 163)",
                        textDecorationColor: "rgb(17, 94, 163)"
                    }}
                    width={"30px"}
                    height={"20px"}
                    src="https://www.svgrepo.com/show/347900/person.svg"
                    alt=""
                />
                <span
                    style={{
                        display: 'inline-block',
                        minWidth: 0,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        marginLeft: '4px',
                        marginRight: '6px',
                        textDecoration: hovered ? 'underline' : 'none',
                        flexShrink: 1,

                    }}
                >lookup Value to test how much space it takes</span>
            </div>
            <div
                style={{
                    marginRight: '5px',
                    marginLeft: '3px',
                    flexShrink: 0
                }}
            >X</div>
        </div>
    );
}