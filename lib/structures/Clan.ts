/** @module Clan */
import * as Routes from "../util/Routes";
import type Client from "../Client";
import type { ImageFormat } from "../Constants";
import type { RawClan } from "../types/users";
import type { JSONClan } from "../types";

/** Represents an invite. */
export default class Clan {
    /** The badge hash of this clan. */
    badge: string;
    client!: Client;
    identityEnabled: boolean;
    identityGuildID: string;
    /** The tag of this clan, shown beside messages. */
    tag: string;
    constructor(data: RawClan, client: Client) {
        Object.defineProperty(this, "client", {
            value:        client,
            enumerable:   false,
            writable:     false,
            configurable: false
        });
        this.badge = data.badge;
        this.identityEnabled = data.identity_enabled;
        this.identityGuildID = data.identity_guild_id;
        this.tag = data.tag;
        this.update(data);
    }

    protected update(data: Partial<RawClan>): void {
        if (data.badge !== undefined) {
            this.badge = data.badge;
        }

        if (data.identity_enabled !== undefined) {
            this.identityEnabled = data.identity_enabled;
        }

        if (data.identity_guild_id !== undefined) {
            this.identityGuildID = data.identity_guild_id;
        }

        if (data.tag !== undefined) {
            this.tag = data.tag;
        }
    }

    /**
     * The url of this guild's icon.
     * @param format The format the url should be.
     * @param size The dimensions of the image.
     */
    badgeURL(format?: ImageFormat, size?: number): string {
        return this.client.util.formatImage(Routes.CLAN_ICON(this.identityGuildID, this.badge), format, size);
    }

    toJSON(): JSONClan {
        return {
            badge:           this.badge,
            identityEnabled: this.identityEnabled,
            identityGuildID: this.identityGuildID,
            tag:             this.tag
        };
    }
}
