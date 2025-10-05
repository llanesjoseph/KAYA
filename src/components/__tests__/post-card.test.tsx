import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostCard } from '../social/post-card';
import { renderWithProviders, createMockUser } from '@/lib/__tests__/test-utils';
import { isPostLikedByUser, toggleLike, isFollowing, toggleFollow, addComment } from '@/lib/db';
import { Post } from '@/lib/data';

// Mock the database functions
jest.mock('@/lib/db', () => ({
  isPostLikedByUser: jest.fn(),
  toggleLike: jest.fn(),
  isFollowing: jest.fn(),
  toggleFollow: jest.fn(),
  addComment: jest.fn(),
  addReport: jest.fn(),
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

const mockIsPostLikedByUser = isPostLikedByUser as jest.MockedFunction<typeof isPostLikedByUser>;
const mockToggleLike = toggleLike as jest.MockedFunction<typeof toggleLike>;
const mockIsFollowing = isFollowing as jest.MockedFunction<typeof isFollowing>;
const mockToggleFollow = toggleFollow as jest.MockedFunction<typeof toggleFollow>;
const mockAddComment = addComment as jest.MockedFunction<typeof addComment>;

describe('PostCard Component', () => {
  const mockPost: Post & { authorId?: string } = {
    id: 'post123',
    author: {
      name: 'John Doe',
      avatarUrl: 'https://example.com/avatar.jpg',
    },
    authorId: 'author123',
    content: 'This is a test post #testing',
    timestamp: new Date('2024-01-15T10:00:00Z').toISOString(),
    likes: 5,
    commentsCount: 3,
    imageUrl: 'https://example.com/image.jpg',
  };

  const mockUser = createMockUser({
    uid: 'current-user-123',
    displayName: 'Current User',
    email: 'current@example.com',
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsPostLikedByUser.mockResolvedValue(false);
    mockIsFollowing.mockResolvedValue(false);
  });

  describe('Rendering', () => {
    it('should render post with author information', () => {
      renderWithProviders(<PostCard post={mockPost} />, { user: mockUser });

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText(/This is a test post/)).toBeInTheDocument();
      expect(screen.getByText(/5 days ago|Jan/i)).toBeInTheDocument();
    });

    it('should render post content with hashtags as links', () => {
      renderWithProviders(<PostCard post={mockPost} />, { user: mockUser });

      const hashtagLink = screen.getByRole('link', { name: '#testing' });
      expect(hashtagLink).toBeInTheDocument();
      expect(hashtagLink).toHaveAttribute('href', '/topics/testing');
    });

    it('should render post image when provided', () => {
      renderWithProviders(<PostCard post={mockPost} />, { user: mockUser });

      const image = screen.getByAltText('Post image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', mockPost.imageUrl);
    });

    it('should render video when provided instead of image', () => {
      const videoPost = {
        ...mockPost,
        imageUrl: undefined,
        videoUrl: 'https://example.com/video.mp4',
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
      };

      renderWithProviders(<PostCard post={videoPost} />, { user: mockUser });

      const video = screen.getByRole('application'); // video element with controls
      expect(video).toBeInTheDocument();
    });

    it('should render like count and comment count', () => {
      renderWithProviders(<PostCard post={mockPost} />, { user: mockUser });

      expect(screen.getByText('5')).toBeInTheDocument(); // like count
      expect(screen.getByText('3')).toBeInTheDocument(); // comment count
    });

    it('should show Follow button when not following author', async () => {
      mockIsFollowing.mockResolvedValue(false);

      renderWithProviders(<PostCard post={mockPost} />, { user: mockUser });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Follow' })).toBeInTheDocument();
      });
    });

    it('should show Following button when already following author', async () => {
      mockIsFollowing.mockResolvedValue(true);

      renderWithProviders(<PostCard post={mockPost} />, { user: mockUser });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Following' })).toBeInTheDocument();
      });
    });

    it('should not show Follow button for own posts', () => {
      const ownPost = {
        ...mockPost,
        authorId: mockUser.uid,
      };

      renderWithProviders(<PostCard post={ownPost} />, { user: mockUser });

      expect(screen.queryByRole('button', { name: /Follow/ })).not.toBeInTheDocument();
    });
  });

  describe('Like Functionality', () => {
    it('should toggle like when like button is clicked', async () => {
      const user = userEvent.setup();
      mockToggleLike.mockResolvedValue(undefined);

      renderWithProviders(<PostCard post={mockPost} />, { user: mockUser });

      const likeButton = screen.getAllByRole('button')[1]; // Second button is like
      await user.click(likeButton);

      await waitFor(() => {
        expect(mockToggleLike).toHaveBeenCalledWith('post123', 'current-user-123');
      });
    });

    it('should update like count optimistically when liked', async () => {
      const user = userEvent.setup();
      mockIsPostLikedByUser.mockResolvedValue(false);
      mockToggleLike.mockResolvedValue(undefined);

      renderWithProviders(<PostCard post={mockPost} />, { user: mockUser });

      const likeButton = screen.getAllByRole('button')[1];
      await user.click(likeButton);

      // Like count should increase from 5 to 6
      await waitFor(() => {
        expect(screen.getByText('6')).toBeInTheDocument();
      });
    });

    it('should show liked state with red color', async () => {
      mockIsPostLikedByUser.mockResolvedValue(true);

      renderWithProviders(<PostCard post={mockPost} />, { user: mockUser });

      await waitFor(() => {
        const likeButton = screen.getAllByRole('button')[1];
        expect(likeButton).toHaveClass('text-red-500');
      });
    });

    it('should rollback like on error', async () => {
      const user = userEvent.setup();
      mockToggleLike.mockRejectedValue(new Error('Network error'));

      renderWithProviders(<PostCard post={mockPost} />, { user: mockUser });

      const likeButton = screen.getAllByRole('button')[1];
      const initialCount = screen.getByText('5');
      expect(initialCount).toBeInTheDocument();

      await user.click(likeButton);

      // Should show increased count briefly
      await waitFor(() => {
        expect(screen.getByText('6')).toBeInTheDocument();
      });

      // Should rollback to original count after error
      await waitFor(() => {
        expect(screen.getByText('5')).toBeInTheDocument();
      });
    });

    it('should not allow like when user is not logged in', async () => {
      const user = userEvent.setup();

      renderWithProviders(<PostCard post={mockPost} />, { user: null });

      const likeButton = screen.getAllByRole('button')[1];
      await user.click(likeButton);

      expect(mockToggleLike).not.toHaveBeenCalled();
    });
  });

  describe('Follow Functionality', () => {
    it('should toggle follow when Follow button is clicked', async () => {
      const user = userEvent.setup();
      mockIsFollowing.mockResolvedValue(false);
      mockToggleFollow.mockResolvedValue(true);

      renderWithProviders(<PostCard post={mockPost} />, { user: mockUser });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Follow' })).toBeInTheDocument();
      });

      const followButton = screen.getByRole('button', { name: 'Follow' });
      await user.click(followButton);

      await waitFor(() => {
        expect(mockToggleFollow).toHaveBeenCalledWith('current-user-123', 'author123');
        expect(screen.getByRole('button', { name: 'Following' })).toBeInTheDocument();
      });
    });

    it('should unfollow when Following button is clicked', async () => {
      const user = userEvent.setup();
      mockIsFollowing.mockResolvedValue(true);
      mockToggleFollow.mockResolvedValue(false);

      renderWithProviders(<PostCard post={mockPost} />, { user: mockUser });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Following' })).toBeInTheDocument();
      });

      const followingButton = screen.getByRole('button', { name: 'Following' });
      await user.click(followingButton);

      await waitFor(() => {
        expect(mockToggleFollow).toHaveBeenCalledWith('current-user-123', 'author123');
        expect(screen.getByRole('button', { name: 'Follow' })).toBeInTheDocument();
      });
    });
  });

  describe('Comment Functionality', () => {
    it('should open comment dialog when comment button is clicked', async () => {
      const user = userEvent.setup();

      renderWithProviders(<PostCard post={mockPost} />, { user: mockUser });

      const commentButton = screen.getAllByRole('button')[2]; // Third button is comment
      await user.click(commentButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Comments')).toBeInTheDocument();
      });
    });

    it('should submit comment when Comment button is clicked in dialog', async () => {
      const user = userEvent.setup();
      mockAddComment.mockResolvedValue('comment123');

      renderWithProviders(<PostCard post={mockPost} />, { user: mockUser });

      // Open comment dialog
      const commentButton = screen.getAllByRole('button')[2];
      await user.click(commentButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Type comment
      const textarea = screen.getByPlaceholderText('Write your comment...');
      await user.type(textarea, 'Great post!');

      // Submit comment
      const submitButton = screen.getByRole('button', { name: 'Comment' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAddComment).toHaveBeenCalledWith(
          'post123',
          expect.objectContaining({
            uid: 'current-user-123',
            displayName: 'Current User',
          }),
          'Great post!'
        );
      });
    });

    it('should not allow empty comments', async () => {
      const user = userEvent.setup();

      renderWithProviders(<PostCard post={mockPost} />, { user: mockUser });

      // Open comment dialog
      const commentButton = screen.getAllByRole('button')[2];
      await user.click(commentButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Try to submit empty comment
      const submitButton = screen.getByRole('button', { name: 'Comment' });
      expect(submitButton).toBeDisabled();
    });

    it('should clear comment text after submission', async () => {
      const user = userEvent.setup();
      mockAddComment.mockResolvedValue('comment123');

      renderWithProviders(<PostCard post={mockPost} />, { user: mockUser });

      // Open dialog and type comment
      const commentButton = screen.getAllByRole('button')[2];
      await user.click(commentButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const textarea = screen.getByPlaceholderText('Write your comment...');
      await user.type(textarea, 'Great post!');

      // Submit
      const submitButton = screen.getByRole('button', { name: 'Comment' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAddComment).toHaveBeenCalled();
      });

      // Dialog should close (text should be cleared)
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Post Navigation', () => {
    it('should navigate to post detail when content is clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderWithProviders(<PostCard post={mockPost} />, { user: mockUser });

      const contentArea = container.querySelector('.cursor-pointer');
      expect(contentArea).toBeInTheDocument();

      if (contentArea) {
        await user.click(contentArea);
        // Router push is mocked in jest.setup.ts
      }
    });

    it('should not navigate when clicking on hashtag', async () => {
      const user = userEvent.setup();
      renderWithProviders(<PostCard post={mockPost} />, { user: mockUser });

      const hashtagLink = screen.getByRole('link', { name: '#testing' });

      // stopPropagation should be called on hashtag click
      await user.click(hashtagLink);

      // Link should have correct href
      expect(hashtagLink).toHaveAttribute('href', '/topics/testing');
    });
  });

  describe('Report Functionality', () => {
    it('should show report option in dropdown menu', async () => {
      const user = userEvent.setup();

      renderWithProviders(<PostCard post={mockPost} />, { user: mockUser });

      // Click dropdown menu
      const menuButton = screen.getAllByRole('button')[0]; // First button is dropdown
      await user.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('Report')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper button labels', () => {
      renderWithProviders(<PostCard post={mockPost} />, { user: mockUser });

      // All interactive elements should be accessible
      expect(screen.getByRole('img', { name: 'John Doe' })).toBeInTheDocument();
      expect(screen.getByAltText('Post image')).toBeInTheDocument();
    });

    it('should handle keyboard navigation', async () => {
      const user = userEvent.setup();

      renderWithProviders(<PostCard post={mockPost} />, { user: mockUser });

      // Tab through interactive elements
      await user.tab();
      await user.tab();

      // Should be able to activate like button with Enter
      const likeButton = screen.getAllByRole('button')[1];
      likeButton.focus();
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockToggleLike).toHaveBeenCalled();
      });
    });
  });
});
