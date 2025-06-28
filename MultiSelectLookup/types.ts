import { IInputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import LookupOptions = ComponentFramework.UtilityApi.LookupOptions;

export interface ILookupProps {
    context: ComponentFramework.Context<IInputs>;
    lookUpRecords: ILookupRecord[]
}

interface targetType {
    entityType: string;
    id: string;
}
export interface ExecuteRequest {
    getMetadata: () => object;
    relationship: string;
    target: targetType;
    relatedEntityId?: string;
    relatedEntities?: targetType[]
}


interface PageContext {
    entityTypeName?: string;
    entityId?: string;
    // Add more if needed like `data`, `attributes`, etc.
}

export interface ExtendedWebApi extends ComponentFramework.WebApi {
    execute?: (request: ExecuteRequest) => Promise<Response>;
}

export interface ExtendedUtils extends ComponentFramework.Utility {
    _customControlProperties?: {
        descriptor?: {
            Parameters?: Record<string, string>;
        };
    };
}

export interface ExtendedContext extends ComponentFramework.Context<IInputs> {
    page?: PageContext;
}

export interface ILookupOptions extends LookupOptions {
    disableMru?: boolean,
    filters?: [{ filterXml: string, entityLogicalName: string }]
}

export interface ILookupRecord {
    id: string,
    entityType: string,
    name: unknown
}

export interface ExtendedEntityRecord extends DataSetInterfaces.EntityRecord {
    _primaryFieldName: string;
}
