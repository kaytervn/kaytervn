/**
 * @swagger
 * tags:
 *   name: PostReaction
 *   description: Post reaction management
 */

/**
 * @swagger
 * /v1/post-reaction/create:
 *   post:
 *     summary: Create a new post reaction
 *     tags: [PostReaction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               post:
 *                 type: string
 *                 description: ID of the post to react to
 */

/**
 * @swagger
 * /v1/post-reaction/delete/{id}:
 *   delete:
 *     summary: Delete a post reaction
 *     tags: [PostReaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to remove reaction from
 */

/**
 * @swagger
 * /v1/post-reaction/list:
 *   get:
 *     summary: Get list of post reactions
 *     tags: [PostReaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: post
 *         schema:
 *           type: string
 *         description: ID of the post to get reactions for
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
