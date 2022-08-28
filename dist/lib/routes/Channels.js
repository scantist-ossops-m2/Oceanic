"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRoute_1 = __importDefault(require("./BaseRoute"));
const Routes = __importStar(require("../util/Routes"));
const Message_1 = __importDefault(require("../structures/Message"));
const Invite_1 = __importDefault(require("../structures/Invite"));
const Channel_1 = __importDefault(require("../structures/Channel"));
class Channels extends BaseRoute_1.default {
    /**
     * Add a user to a group channel.
     *
     * @param {String} groupID - The id of the group to add the user to.
     * @param {Object} options
     * @param {String} options.accessToken - The access token of the user to add.
     * @param {String} [options.nick] - The nickname of the user to add.
     * @param {String} options.userID - The id of the user to add.
     * @returns {Promise<void>}
     */
    async addGroupRecipient(groupID, options) {
        await this._manager.authRequest({
            method: "PUT",
            path: Routes.GROUP_RECIPIENT(groupID, options.userID),
            json: {
                access_token: options.accessToken,
                nick: options.nick
            }
        });
    }
    /**
     * Add a member to a thread.
     *
     * @param {String} id - The id of the thread to add them to.
     * @param {String} userID - The id of the user to add to the thread.
     * @returns {Promise<void>}
     */
    async addThreadMember(id, userID) {
        await this._manager.authRequest({
            method: "PUT",
            path: Routes.CHANNEL_THREAD_MEMBER(id, userID)
        });
    }
    /**
     * Create an invite for a channel.
     *
     * @param {String} id - The id of the channel to create an invite for.
     * @param {Object} options
     * @param {Number} [options.maxAge] - How long the invite should last.
     * @param {Number} [options.maxUses] - How many times the invite can be used.
     * @param {String} [options.reason] - The reason for creating the invite.
     * @param {String} [options.targetApplicationID] - The id of the embedded application to open for this invite.
     * @param {InviteTargetTypes} [options.targetType] - The [type of target](https://discord.com/developers/docs/resources/channel#invite-target-types) for the invite.
     * @param {String} [options.targetUserID] - The id of the user whose stream to display for this invite.
     * @param {Boolean} [options.temporary] - If the invite should be temporary.
     * @param {Boolean} [options.unique] - If the invite should be unique.
     * @returns {Promise<Invite>}
     */
    async createInvite(id, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        return this._manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_INVITES(id),
            json: {
                max_age: options.maxAge,
                max_uses: options.maxUses,
                target_application_id: options.targetApplicationID,
                target_type: options.targetType,
                target_user_id: options.targetUserID,
                temporary: options.temporary,
                unique: options.unique
            },
            reason
        }).then(data => new Invite_1.default(data, this._client));
    }
    /**
     * Create a message in a channel.
     *
     * @template {AnyTextChannel} T
     * @param {String} id - The id of the channel to create the message in.
     * @param {Object} options
     * @param {Object} [options.allowedMentions] - An object that specifies the allowed mentions in this message.
     * @param {Boolean} [options.allowedMentions.everyone] - If `@everyone`/`@here` mentions should be allowed.
     * @param {Boolean} [options.allowedMentions.repliedUser] - If the replied user (`messageReference`) should be mentioned.
     * @param {(Boolean | String[])} [options.allowedMentions.roles] - An array of role ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {(Boolean | String[])} [options.allowedMentions.users] - An array of user ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {Object[]} [options.attachments] - An array of [attachment information](https://discord.com/developers/docs/resources/channel#attachment-object) related to the sent files.
     * @param {Object[]} [options.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send.
     * @param {String} [options.content] - The content of the message.
     * @param {Object[]} [options.embeds] - An array of [embeds](https://discord.com/developers/docs/resources/channel#embed-object) to send.
     * @param {File[]} [options.files] - The files to send.
     * @param {Number} [options.flags] - The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to send with the message.
     * @param {String[]} [options.stickerIDs] - The IDs of up to 3 stickers from the current guild to send.
     * @param {Object} [options.messageReference] - Reply to a message.
     * @param {String} [options.messageReference.channelID] - The id of the channel the replied message is in.
     * @param {Boolean} [options.messageReference.failIfNotExists] - If creating the message should fail if the message to reply to does not exist.
     * @param {String} [options.messageReference.guildID] - The id of the guild the replied message is in.
     * @param {String} [options.messageReference.messageID] - The id of the message to reply to.
     * @param {Boolean} [options.tts] - If the message should be spoken aloud.
     * @returns {Promise<Message<T>>}
     */
    async createMessage(id, options) {
        const files = options.files;
        if (options.files)
            delete options.files;
        return this._manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_MESSAGES(id),
            json: {
                allowed_mentions: this._client._formatAllowedMentions(options.allowedMentions),
                attachments: options.attachments,
                components: options.components,
                content: options.content,
                embeds: options.embeds,
                flags: options.flags,
                sticker_ids: options.stickerIDs,
                message_reference: !options.messageReference ? undefined : {
                    channel_id: options.messageReference.channelID,
                    fail_if_not_exists: options.messageReference.failIfNotExists,
                    guild_id: options.messageReference.guildID,
                    message_id: options.messageReference.messageID
                },
                tts: options.tts
            },
            files
        }).then(data => new Message_1.default(data, this._client));
    }
    /**
     * Add a reaction to a message.
     *
     * @param {String} id - The id of the channel the message is in.
     * @param {String} messageID - The id of the message to add a reaction to.
     * @param {String} emoji - The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @returns {Promise<void>}
     */
    async createReaction(id, messageID, emoji) {
        if (emoji === decodeURIComponent(emoji))
            emoji = encodeURIComponent(emoji);
        await this._manager.authRequest({
            method: "PUT",
            path: Routes.CHANNEL_REACTION_USER(id, messageID, emoji, "@me")
        });
    }
    /**
     * Crosspost a message in an announcement channel.
     *
     * @param {String} id - The id of the channel to crosspost the message in.
     * @param {String} messageID - The id of the message to crosspost.
     * @returns {Promise<Message<AnnouncementChannel>>}
     */
    async crosspostMessage(id, messageID) {
        return this._manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_MESSAGES_CROSSPOST(id, messageID)
        }).then(data => new Message_1.default(data, this._client));
    }
    /**
     * Delete or close a channel.
     *
     * @param {String} id - The ID of the channel to delete or close.
     * @param {String} [reason] - The reason to be displayed in the audit log.
     * @returns {Promise<void>}
     */
    async delete(id, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.CHANNEL(id),
            reason
        });
    }
    /**
     * Delete an invite.
     *
     * @param {String} code - The code of the invite to delete.
     * @param {String} [reason] - The reason for deleting the invite.
     * @returns {Promise<Invite>}
     */
    async deleteInvite(code, reason) {
        return this._manager.authRequest({
            method: "DELETE",
            path: Routes.INVITE(code),
            reason
        }).then(data => new Invite_1.default(data, this._client));
    }
    /**
     * Delete a message.
     *
     * @param {String} id - The id of the channel to delete the message in.
     * @param {String} messageID - The id of the message to delete.
     * @param {String} [reason] - The reason for deleting the message.
     * @returns {Promise<void>}
     */
    async deleteMessage(id, messageID, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.CHANNEL_MESSAGE(id, messageID),
            reason
        });
    }
    /**
     * Bulk delete messages.
     *
     * @param {String} id - The id of the channel to delete the messages in.
     * @param {String[]} messageIDs - The ids of the messages to delete. Between 2 and 100 messages, any dupliates or messages older than two weeks will cause an error.
     * @param {String} [reason] - The reason for deleting the messages.
     * @returns {Promise<void>}
     */
    async deleteMessages(id, messageIDs, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.CHANNEL_BULK_DELETE_MESSAGES(id),
            json: {
                messages: messageIDs
            },
            reason
        });
    }
    /**
     * Delete a permission overwrite.
     *
     * @param {String} id - The id of the channel to delete the permission overwrite in.
     * @param {String} overwriteID - The id of the permission overwrite to delete.
     * @param {String} reason - The reason for deleting the permission overwrite.
     * @returns {Promise<void>}
     */
    async deletePermission(id, overwriteID, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.CHANNEL_PERMISSION(id, overwriteID),
            reason
        });
    }
    /**
     * Remove a reaction from a message.
     *
     * @param {String} id - The id of the channel the message is in.
     * @param {String} messageID - The id of the message to remove a reaction from.
     * @param {String} emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param {String} [user="@me"] - The user to remove the reaction from, `@me` for the current user (default).
     * @returns {Promise<void>}
     */
    async deleteReaction(id, messageID, emoji, user = "@me") {
        if (emoji === decodeURIComponent(emoji))
            emoji = encodeURIComponent(emoji);
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.CHANNEL_REACTION_USER(id, messageID, emoji, user)
        });
    }
    /**
     * Remove all, or a specific emoji's reactions from a message.
     *
     * @param {String} id - The id of the channel the message is in.
     * @param {String} messageID - The id of the message to remove reactions from.
     * @param {String} [emoji] - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
     * @returns {Promise<void>}
     */
    async deleteReactions(id, messageID, emoji) {
        if (emoji && emoji === decodeURIComponent(emoji))
            emoji = encodeURIComponent(emoji);
        await this._manager.authRequest({
            method: "DELETE",
            path: !emoji ? Routes.CHANNEL_REACTIONS(id, messageID) : Routes.CHANNEL_REACTION(id, messageID, emoji)
        });
    }
    /**
     * Edit a channel.
     *
     * @param {String} id - The id of the channel to edit.
     * @param {Object} options
     * @param {Boolean} [options.archived] - [Thread] If the thread is archived.
     * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - [Thread] The duration after which the thread will be archived.
     * @param {?Number} [options.bitrate] - [Voice, Stage] The bitrate of the channel. Minimum 8000.
     * @param {?ThreadAutoArchiveDuration} [options.defaultAutoArchiveDuration] - [Text, Announcement] The default auto archive duration for threads made in this channel.
     * @param {Number} [options.flags] - [Thread] The [channel flags](https://discord.com/developers/docs/resources/channel#channel-object-channel-flags) to set on the channel.
     * @param {?String} [options.icon] - [Group DM] The icon of the channel.
     * @param {Boolean} [options.invitable] - [Private Thread] If non-moderators can add other non-moderators to the thread. Private threads only.
     * @param {Boolean} [options.locked] - [Thread] If the thread should be locked.
     * @param {String} [options.name] - [All] The name of the channel.
     * @param {?Boolean} [options.nsfw] -[Text, Voice, Announcement] - If the channel is age gated.
     * @param {?String} [options.parentID] - [Text, Voice, Announcement] The id of the parent category channel.
     * @param {?RawOverwrite[]} [options.permissionOverwrites] - [All Guild] Channel or category specific permissions
     * @param {?Number} [options.position] - [All Guild] The position of the channel in the channel list.
     * @param {?Number} [options.rateLimitPerUser] - [Thread, Text] The seconds between sending messages for users. Between 0 and 21600.
     * @param {String} [options.reason] - The reason to be displayed in the audit log.
     * @param {?String} [options.rtcRegion] - [Voice, Stage] The voice region id of the channel, null for automatic.
     * @param {?String} [options.topic] - [Text, Announcement] The topic of the channel.
     * @param {ChannelTypes.GUILD_TEXT | ChannelTypes.GUILD_ANNOUNCEMENT} [options.type] - [Text, Announcement] Provide the opposite type to convert the channel.
     * @param {?Number} [options.userLimit] - [Voice] The maximum amount of users in the channel. `0` is unlimited, values range 1-99.
     * @param {?VideoQualityModes} [options.videoQualityMode] - [Voice] The [video quality mode](https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes) of the channel.
     * @returns {Promise<AnyChannel>}
     */
    async edit(id, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        if (options.icon) {
            try {
                options.icon = this._client._convertImage(options.icon);
            }
            catch (err) {
                throw new Error("Invalid icon provided. Ensure you are providing a valid, fully-qualified base64 url.", { cause: err });
            }
        }
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.CHANNEL(id),
            json: {
                archived: options.archived,
                auto_archive_duration: options.autoArchiveDuration,
                bitrate: options.bitrate,
                default_auto_archive_duration: options.defaultAutoArchiveDuration,
                flags: options.flags,
                icon: options.icon,
                invitable: options.invitable,
                locked: options.locked,
                name: options.name,
                nsfw: options.nsfw,
                parent_id: options.parentID,
                permission_overwrites: options.permissionOverwrites,
                position: options.position,
                rate_limit_per_user: options.rateLimitPerUser,
                rtc_region: options.rtcRegion,
                topic: options.topic,
                type: options.type,
                user_limit: options.userLimit,
                video_quality_mode: options.videoQualityMode
            },
            reason
        }).then(data => Channel_1.default.from(data, this._client));
    }
    /**
     * Edit a message.
     *
     * @template {AnyTextChannel} T
     * @param {String} id - The id of the channel the message is in.
     * @param {String} messageID - The id of the message to edit.
     * @param {Object} options
     * @param {Object} [options.allowedMentions] - An object that specifies the allowed mentions in this message.
     * @param {Boolean} [options.allowedMentions.everyone] - If `@everyone`/`@here` mentions should be allowed.
     * @param {Boolean} [options.allowedMentions.repliedUser] - If the replied user (`messageReference`) should be mentioned.
     * @param {(Boolean | String[])} [options.allowedMentions.roles] - An array of role ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {(Boolean | String[])} [options.allowedMentions.users] - An array of user ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {Object[]} [options.attachments] - An array of [attachment information](https://discord.com/developers/docs/resources/channel#attachment-object) related to the sent files.
     * @param {Object[]} [options.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send.
     * @param {String} [options.content] - The content of the message.
     * @param {Object[]} [options.embeds] - An array of [embeds](https://discord.com/developers/docs/resources/channel#embed-object) to send.
     * @param {File[]} [options.files] - The files to send.
     * @returns {Promise<Message<T>>}
     */
    async editMessage(id, messageID, options) {
        const files = options.files;
        if (options.files)
            delete options.files;
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.CHANNEL_MESSAGE(id, messageID),
            json: {
                allowed_mentions: this._client._formatAllowedMentions(options.allowedMentions),
                attachments: options.attachments,
                components: options.components,
                content: options.content,
                embeds: options.embeds,
                flags: options.flags
            },
            files
        }).then(data => new Message_1.default(data, this._client));
    }
    /**
     * Edit a permission overwrite.
     *
     * @param {String} id - The id of the channel to edit the permission overwrite for.
     * @param {String} overwriteID - The id of the permission overwrite to edit.
     * @param {Object} options
     * @param {(BigInt | String)} [options.allow] - The permissions to allow.
     * @param {(BigInt | String)} [options.deny] - The permissions to deny.
     * @param {String} [options.reason] - The reason for editing the permission.
     * @param {OverwriteTypes} [options.type] - The type of the permission overwrite.
     * @returns {Promise<void>}
     */
    async editPermission(id, overwriteID, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        await this._manager.authRequest({
            method: "PUT",
            path: Routes.CHANNEL_PERMISSION(id, overwriteID),
            json: {
                allow: options.allow,
                deny: options.deny,
                type: options.type
            },
            reason
        });
    }
    /**
     * Follow an announcement channel.
     *
     * @param {String} id - The id of the channel to follow the announcement channel to.
     * @param {Object} options
     * @param {String} [options.webhookChannelID] - The id of the channel to follow.
     * @returns {Promise<FollowedChannel>}
     */
    async followAnnouncement(id, options) {
        return this._manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_FOLLOWERS(id),
            json: options
        }).then(data => ({
            channelID: data.channel_id,
            webhookID: data.webhook_id
        }));
    }
    /**
     * Get a channel.
     *
     * @param {String} id - The id of the channel to get.
     * @returns {Promise<AnyChannel>}
     */
    async get(id) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL(id)
        }).then(data => Channel_1.default.from(data, this._client));
    }
    async getInvite(code, options) {
        const query = new URLSearchParams();
        if (options?.guildScheduledEventID)
            query.set("guild_scheduled_event_id", options.guildScheduledEventID);
        if (options?.withCounts)
            query.set("with_counts", "true");
        if (options?.withExpiration)
            query.set("with_expiration", "true");
        return this._manager.authRequest({
            method: "GET",
            path: Routes.INVITE(code),
            query
        }).then(data => new Invite_1.default(data, this._client));
    }
    /**
     * Get the invites of a channel.
     *
     * @param {String} id - The id of the channel to get the invites of.
     * @returns {Promise<Invite[]>} - An array of invites with metadata.
     */
    async getInvites(id) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_INVITES(id)
        }).then(data => data.map(invite => new Invite_1.default(invite, this._client)));
    }
    /**
     * Get the private archived threads the current user has joined in a channel.
     *
     * @param {String} id - The id of the channel to get the archived threads from.
     * @param {Object} [options]
     * @param {String} [options.before] - A **timestamp** to get threads before.
     * @param {Number} [options.limit] - The maximum amount of threads to get.
     * @returns {Promise<ArchivedThreads<PrivateThreadChannel>>}
     */
    async getJoinedPrivateArchivedThreads(id, options) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_PRIVATE_ARCHIVED_THREADS(id),
            json: {
                before: options?.before,
                limit: options?.limit
            }
        }).then(data => ({
            hasMore: data.has_more,
            members: data.members.map(m => ({
                flags: m.flags,
                id: m.id,
                joinTimestamp: new Date(m.join_timestamp),
                userID: m.user_id
            })),
            threads: data.threads.map(d => Channel_1.default.from(d, this._client))
        }));
    }
    /**
     * Get a message in a channel.
     *
     * @template {AnyTextChannel} T
     * @param {String} id - The id of the channel the message is in
     * @param {String} messageID - The id of the message to get.
     * @returns {Promise<Message<T>>}
     */
    async getMessage(id, messageID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_MESSAGE(id, messageID)
        }).then(data => new Message_1.default(data, this._client));
    }
    /**
     * Get messages in a channel.
     *
     * @template {AnyTextChannel} T
     * @param {String} id - The id of the channel to get messages from.
     * @param {Object} options - All options are mutually exclusive.
     * @param {String} [options.after] - Get messages after this message id.
     * @param {String} [options.around] - Get messages around this message id.
     * @param {String} [options.before] - Get messages before this message id.
     * @param {Number} [options.limit] - The maximum amount of messages to get.
     * @returns {Promise<Message<T>[]>}
     */
    async getMessages(id, options) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_MESSAGES(id),
            json: {
                after: options?.after,
                around: options?.around,
                before: options?.before,
                limit: options?.limit
            }
        }).then(data => data.map(d => new Message_1.default(d, this._client)));
    }
    /**
     * Get the pinned messages in a channel.
     *
     * @template {AnyTextChannel} T
     * @param {String} id - The id of the channel to get the pinned messages from.
     * @returns {Promise<Message<T>[]>}
     */
    async getPinnedMessages(id) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_PINS(id)
        }).then(data => data.map(d => new Message_1.default(d, this._client)));
    }
    /**
     * Get the private archived threads in a channel.
     *
     * @param {String} id - The id of the channel to get the archived threads from.
     * @param {Object} [options]
     * @param {String} [options.before] - A **timestamp** to get threads before.
     * @param {Number} [options.limit] - The maximum amount of threads to get.
     * @returns {Promise<ArchivedThreads<PrivateThreadChannel>>}
     */
    async getPrivateArchivedThreads(id, options) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_PRIVATE_ARCHIVED_THREADS(id),
            json: {
                before: options?.before,
                limit: options?.limit
            }
        }).then(data => ({
            hasMore: data.has_more,
            members: data.members.map(m => ({
                flags: m.flags,
                id: m.id,
                joinTimestamp: new Date(m.join_timestamp),
                userID: m.user_id
            })),
            threads: data.threads.map(d => Channel_1.default.from(d, this._client))
        }));
    }
    /**
     * Get the public archived threads in a channel.
     *
     * @template {(AnnouncementThreadChannel | PublicThreadChannel)} T
     * @param {String} id - The id of the channel to get the archived threads from.
     * @param {Object} [options]
     * @param {String} [options.before] - A **timestamp** to get threads before.
     * @param {Number} [options.limit] - The maximum amount of threads to get.
     * @returns {Promise<ArchivedThreads<T>>}
     */
    async getPublicArchivedThreads(id, options) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_PUBLIC_ARCHIVED_THREADS(id),
            json: {
                before: options?.before,
                limit: options?.limit
            }
        }).then(data => ({
            hasMore: data.has_more,
            members: data.members.map(m => ({
                flags: m.flags,
                id: m.id,
                joinTimestamp: new Date(m.join_timestamp),
                userID: m.user_id
            })),
            threads: data.threads.map(d => Channel_1.default.from(d, this._client))
        }));
    }
    /**
     * Get the users who reacted with a specific emoji on a message.
     *
     * @param {String} id - The id of the channel the message is in.
     * @param {String} messageID - The id of the message to get reactions from.
     * @param {String} emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param {Object} [options] - Options for the request.
     * @param {String} [options.after] - Get users after this user id.
     * @param {Number} [options.limit] - The maximum amount of users to get.
     * @returns {Promise<User[]>}
     */
    async getReactions(id, messageID, emoji, options) {
        if (emoji === decodeURIComponent(emoji))
            emoji = encodeURIComponent(emoji);
        return this._manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_REACTION(id, messageID, emoji),
            json: {
                after: options?.after,
                limit: options?.limit
            }
        }).then(data => data.map(d => this._client.users.update(d)));
    }
    /**
     * Get a thread member.
     *
     * @param {String} id - The id of the thread.
     * @param {String} userID - The id of the user to get the thread member of.
     * @returns {Promise<ThreadMember>}
     */
    async getThreadMember(id, userID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_THREAD_MEMBER(id, userID)
        }).then(data => ({
            flags: data.flags,
            id: data.id,
            joinTimestamp: new Date(data.join_timestamp),
            userID: data.user_id
        }));
    }
    /**
     * Get the members of a thread.
     *
     * @param {String} id - The id of the thread.
     * @returns {Promise<ThreadMember[]>}
     */
    async getThreadMembers(id) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_THREAD_MEMBERS(id)
        }).then(data => data.map(d => ({
            flags: d.flags,
            id: d.id,
            joinTimestamp: new Date(d.join_timestamp),
            userID: d.user_id
        })));
    }
    /**
     * Get the list of usable voice regions.
     *
     * @returns {Promise<VoiceRegion[]>}
     */
    async getVoiceRegions() {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.VOICE_REGIONS
        });
    }
    /**
     * Join a thread.
     *
     * @param {String} id - The id of the thread to join.
     * @returns {Promise<void>}
     */
    async joinThread(id) {
        await this._manager.authRequest({
            method: "PUT",
            path: Routes.CHANNEL_THREAD_MEMBER(id, "@me")
        });
    }
    /**
     * Leave a thread.
     *
     * @param {String} id - The id of the thread to leave.
     * @returns {Promise<void>}
     */
    async leaveThread(id) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.CHANNEL_THREAD_MEMBER(id, "@me")
        });
    }
    /**
     * Pin a message in a channel.
     *
     * @param {String} id - The id of the channel to pin the message in.
     * @param {String} messageID - The id of the message to pin.
     * @param {String} [reason] - The reason for pinning the message.
     * @returns {Promise<void>}
     */
    async pinMessage(id, messageID, reason) {
        await this._manager.authRequest({
            method: "PUT",
            path: Routes.CHANNEL_PINNED_MESSAGE(id, messageID),
            reason
        });
    }
    /**
     * Remove a user from the group channel.
     *
     * @param {String} groupID - The id of the group to remove the user from.
     * @param {String} userID - The id of the user to remove.
     * @returns {Promise<void>}
     */
    async removeGroupRecipient(groupID, userID) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.GROUP_RECIPIENT(groupID, userID)
        });
    }
    /**
     * Remove a member from a thread.
     *
     * @param {String} id - The id of the thread to remove them from.
     * @param {String} userID - The id of the user to remove from the thread.
     * @returns {Promise<void>}
     */
    async removeThreadMember(id, userID) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.CHANNEL_THREAD_MEMBER(id, userID)
        });
    }
    /**
     * Show a typing indicator in a channel. How long users see this varies from client to client.
     *
     * @param {String} id - The id of the channel to show the typing indicator in.
     * @returns {Promise<void>}
     */
    async sendTyping(id) {
        await this._manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_TYPING(id)
        });
    }
    /**
     * Create a thread from an existing message.
     *
     * @template {(AnnouncementThreadChannel | PublicThreadChannel)} T
     * @param {String} id - The id of the channel to create the thread in.
     * @param {String} messageID - The id of the message to create the thread from.
     * @param {Object} options
     * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - The duration of no activity after which this thread will be automatically archived.
     * @param {String} options.name - The name of the thread.
     * @param {Number?} [options.rateLimitPerUser] - The amount of seconds a user has to wait before sending another message.
     * @param {String} [options.reason] - The reason for creating the thread.
     * @returns {Promise<T>}
     */
    async startThreadFromMessage(id, messageID, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        return this._manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_MESSAGE_THREADS(id, messageID),
            json: {
                auto_archive_duration: options.autoArchiveDuration,
                name: options.name,
                rate_limit_per_user: options.rateLimitPerUser
            },
            reason
        }).then(data => Channel_1.default.from(data, this._client));
    }
    /**
     * Create a thread in a forum channel.
     *
     * @param {String} id
     * @param {Object} options
     * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - The duration of no activity after which this thread will be automatically archived.
     * @param {String} options.name - The name of the thread.
     * @param {Number?} [options.rateLimitPerUser] - The amount of seconds a user has to wait before sending another message.
     * @param {String} [options.reason] - The reason for creating the thread.
     * @param {Object} options.message - The message to start the thread with.
     * @param {Object} [options.message.allowedMentions] - An object that specifies the allowed mentions in this message.
     * @param {Boolean} [options.message.allowedMentions.everyone] - If `@everyone`/`@here` mentions should be allowed.
     * @param {Boolean} [options.message.allowedMentions.repliedUser] - If the replied user (`messageReference`) should be mentioned.
     * @param {(Boolean | String[])} [options.message.allowedMentions.roles] - An array of role ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {(Boolean | String[])} [options.message.allowedMentions.users] - An array of user ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {Object[]} [options.message.attachments] - An array of [attachment information](https://discord.com/developers/docs/resources/channel#attachment-object) related to the sent files.
     * @param {Object[]} [options.message.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send.
     * @param {String} [options.message.content] - The content of the message.
     * @param {Object[]} [options.message.embeds] - An array of [embeds](https://discord.com/developers/docs/resources/channel#embed-object) to send.
     * @param {File[]} [options.message.files] - The files to send.
     * @param {Number} [options.message.flags] - The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to send with the message.
     * @param {String[]} [options.message.stickerIDs] - The IDs of up to 3 stickers from the current guild to send.
     * @returns {Promise<PublicThreadChannel>}
     */
    async startThreadInForum(id, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        const files = options.message.files;
        if (options.message.files)
            delete options.message.files;
        return this._manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_THREADS(id),
            json: {
                auto_archive_duration: options.autoArchiveDuration,
                message: {
                    allowed_mentions: this._client._formatAllowedMentions(options.message.allowedMentions),
                    attachments: options.message.attachments,
                    components: options.message.components,
                    content: options.message.content,
                    embeds: options.message.embeds,
                    flags: options.message.flags,
                    sticker_ids: options.message.stickerIDs
                },
                name: options.name,
                rate_limit_per_user: options.rateLimitPerUser
            },
            reason,
            files
        }).then(data => Channel_1.default.from(data, this._client));
    }
    /**
     * Create a thread without an existing message.
     *
     * @template {(AnnouncementThreadChannel | PublicThreadChannel | PrivateThreadChannel)} T
     * @param {String} id
     * @param {Object} options
     * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - The duration of no activity after which this thread will be automatically archived.
     * @param {Boolean} [options.invitable] - [Private] If non-moderators can add other non-moderators to the thread.
     * @param {String} options.name - The name of the thread.
     * @param {Number?} [options.rateLimitPerUser] - The amount of seconds a user has to wait before sending another message.
     * @param {String} [options.reason] - The reason for creating the thread.
     * @param {ThreadChannelTypes} [options.type] - The type of thread to create.
     * @returns {Promise<T>}
     */
    async startThreadWithoutMessage(id, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        return this._manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_THREADS(id),
            json: {
                auto_archive_duration: options.autoArchiveDuration,
                invitable: options.invitable,
                name: options.name,
                rate_limit_per_user: options.rateLimitPerUser,
                type: options.type
            },
            reason
        }).then(data => Channel_1.default.from(data, this._client));
    }
    /**
     * Unpin a message in a channel.
     *
     * @param {String} id - The id of the channel to unpin the message in.
     * @param {String} messageID - The id of the message to unpin.
     * @param {String} [reason] - The reason for unpinning the message.
     * @returns {Promise<void>}
     */
    async unpinMessage(id, messageID, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.CHANNEL_PINNED_MESSAGE(id, messageID),
            reason
        });
    }
}
exports.default = Channels;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbm5lbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvcm91dGVzL0NoYW5uZWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0REFBb0M7QUE4Q3BDLHVEQUF5QztBQUN6QyxvRUFBNEM7QUFJNUMsa0VBQTBDO0FBTTFDLG9FQUE0QztBQUU1QyxNQUFxQixRQUFTLFNBQVEsbUJBQVM7SUFDOUM7Ozs7Ozs7OztPQVNHO0lBQ0gsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQWUsRUFBRSxPQUFpQztRQUN6RSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFPO1lBQ3JDLE1BQU0sRUFBRSxLQUFLO1lBQ2IsSUFBSSxFQUFJLE1BQU0sQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDdkQsSUFBSSxFQUFJO2dCQUNQLFlBQVksRUFBRSxPQUFPLENBQUMsV0FBVztnQkFDakMsSUFBSSxFQUFVLE9BQU8sQ0FBQyxJQUFJO2FBQzFCO1NBQ0QsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILEtBQUssQ0FBQyxlQUFlLENBQUMsRUFBVSxFQUFFLE1BQWM7UUFDL0MsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBTztZQUNyQyxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBSSxNQUFNLENBQUMscUJBQXFCLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQztTQUNoRCxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7O09BY0c7SUFDSCxLQUFLLENBQUMsWUFBWSxDQUFzRSxFQUFVLEVBQUUsT0FBNEI7UUFDL0gsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUM5QixJQUFJLE9BQU8sQ0FBQyxNQUFNO1lBQUUsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFD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