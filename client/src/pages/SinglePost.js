import gql from "graphql-tag";
import React, { useContext, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react/hooks";
import {
  Segment,
  Dimmer,
  Loader,
  Image,
  Grid,
  Card,
  Button,
  Icon,
  Label,
  Form,
  Transition,
  Popup,
} from "semantic-ui-react";
import moment from "moment";
import LikeButton from "../components/LikeButton";

import { AuthContext } from "../context/auth";
import DeleteButton from "../components/DeleteButton";

const SinglePost = (props) => {
  const { user } = useContext(AuthContext);
  const postId = props.match.params.postId;
  const commentInputRef = useRef(null);

  const [commentBody, setCommentBody] = useState("");

  const { data, loading } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
    update: () => {
      setCommentBody("");
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: commentBody,
    },
  });

  const deletePostCallback = () => {
    props.history.push("/");
  };

  let postMarkup;

  if (loading) {
    postMarkup = (
      <Segment>
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>

        <Image src="https://react.semantic-ui.com//images/wireframe/short-paragraph.png" />
      </Segment>
    );
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      commentCount,
      likeCount,
    } = data.getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width="2">
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              floated="right"
            />
          </Grid.Column>
          <Grid.Column width="10">
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount }} />
                <Popup
                  content="Comment"
                  inverted
                  trigger={
                    <Button
                      as="div"
                      labelPosition="right"
                      onClick={() => console.log("Comment on post")}
                    >
                      <Button basic color="blue">
                        <Icon
                          name={commentCount > 1 ? "comments" : "comment"}
                        />
                      </Button>
                      <Label basic color="blue" pointing="left">
                        {commentCount}
                      </Label>
                    </Button>
                  }
                />
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment..."
                        name="comment"
                        value={commentBody}
                        onChange={(e) => setCommentBody(e.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={commentBody.trim() === ""}
                        onClick={createComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            <Transition.Group>
              {comments.map((comment) => (
                <Card fluid key={comment.id}>
                  <Card.Content>
                    {user && user.username === comment.username && (
                      <DeleteButton postId={id} commentId={comment.id} />
                    )}
                    <Card.Header>{comment.username}</Card.Header>
                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                    <Card.Description>{comment.body}</Card.Description>
                  </Card.Content>
                </Card>
              ))}
            </Transition.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
};

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        createdAt
        body
        username
      }
      commentCount
    }
  }
`;

export default SinglePost;
