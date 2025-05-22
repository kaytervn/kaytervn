/**
 * @swagger
 * tags:
 *   name: CommentReaction
 *   description: Comment reaction management
 */

/**
 * @swagger
 * /v1/comment-reaction/create:
 *   post:
 *     summary: Create a new comment reaction
 *     tags: [CommentReaction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 description: ID of the comment to react to
 */

/**
 * @swagger
 * /v1/comment-reaction/delete/{id}:
 *   delete:
 *     summary: Delete a comment reaction
 *     tags: [CommentReaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to remove reaction from
 */

/**
 * @swagger
 * /v1/comment-reaction/list:
 *   get:
 *     summary: Get list of comment reactions
 *     tags: [CommentReaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: comment
 *         schema:
 *           type: string
 *         description: ID of the comment to get reactions for
 *       - in: query
 *         name: isPaged
 *         schema:
 *           type: string
 *         description: Set to "0" for unpaged results
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number for pagination
 *       - in: query
 *         name: size
 *         schema:
 *           type: number
 *         description: Number of items per page
 */
