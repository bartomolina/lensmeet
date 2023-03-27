import { PostFragment, CommentFragment } from "@lens-protocol/react";

type IEvent = {
  _event: PostFragment | CommentFragment;
  attendees: ProfileFragment[];
};