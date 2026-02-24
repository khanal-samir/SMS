# Chat Socket Future Enhancements

This document lists potential improvements for the chat socket system beyond the initial MVP.

## Real-time UX

- **Typing indicators**: broadcast `typing:start` / `typing:stop` events per room.
- **Online presence**: maintain a connected-user map per chat group and emit presence updates.
- **Read receipts**: track last read message per user and show seen indicators.

## Message Experience

- **Unread counts**: store last read cursor and compute unread badges.
- **Pagination / infinite scroll**: load older messages with cursor-based pagination (already scaffolded).
- **Message editing/deletion**: allow users to edit or delete their own messages with audit logs.
- **Reactions**: add emoji reactions with a join table.

## Media + Files

- **File/image sharing**: integrate with a file storage service and send signed URLs.
- **Message attachments**: add an `attachments` array to messages.

## Search & Moderation

- **Search**: full-text search on message content by chat group.
- **Moderation tools**: admin-only message removal and user muting.

## Performance & Scalability

- **Message batching**: throttle high-frequency events.
- **Redis adapter**: use `@socket.io/redis-adapter` for multi-instance scaling.
- **Rate limiting**: basic per-user message rate limits.

## Reliability

- **Delivery acknowledgements**: confirm message delivery with ack callbacks.
- **Retry queues**: store failed outbound events for retry.
