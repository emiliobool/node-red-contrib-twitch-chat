import { Red } from "node-red";
import { CommandNodes } from "./commands";
import { EventNodes } from "./events";
import { MessageNode } from "./message";
import { ConfigNode } from "./config";

export = function(RED: Red){
    ConfigNode(RED)
    CommandNodes(RED)
    EventNodes(RED)
    MessageNode(RED)
}