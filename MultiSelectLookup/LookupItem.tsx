import * as React from 'react';
import { useState } from 'react';
import { IInputs } from './generated/ManifestTypes';
import { ExtendedUtils, ExtendedContext, ExecuteRequest, ExtendedWebApi, IEntityRef, ILookupItemProps } from './types';
import { Icon } from '@fluentui/react/lib/Icon';

export const LookupItem: React.FC<ILookupItemProps> = (props) => {
    const [hovered, setHovered] = useState(false);
    return (
        <div style={{
            display: 'inline-flex',
            flexDirection: 'row',
            borderRadius: '4px',
            backgroundColor: hovered ? 'rgb(189, 219, 253)' : 'rgb(235, 243, 252)',
            width: 'fit-content',
            maxWidth: "200px",
            alignItems: 'center',
            color: 'rgb(17, 94, 163)',
            height: '24px',
            boxShadow: hovered
                ? '0 4px 6px rgba(0, 0, 0, 0.1)'
                : '0 2px 4px rgba(0, 0, 0, 0.05)',
            transition: 'background-color 50ms ease, box-shadow 0.3s ease',
            cursor: 'pointer',
            userSelect: 'none',
            boxSizing: 'border-box'
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
                        display: 'block',
                        minWidth: 0,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        marginLeft: '4px',
                        marginRight: '6px',
                        textDecoration: 'underline',
                        flexShrink: 1,
                        fontWeight: 400,
                        fontSize: '14px',
                        cursor: 'pointer'
                    }}
                >{props.record.name}</span>
            </div>
            <Icon
                style={{
                    marginRight: '4px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                }}
                iconName='Cancel'
            />
        </div>
    );
}