import {PDSAttribute} from "./PDSAttribute";
import {PDSLeaf} from "./PDSLeaf";

export type PDSNode = {
    name: string,
    attributes: [PDSAttribute],
    nodes: [PDSNode],
    leaves: [PDSLeaf]
}
