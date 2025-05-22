/**
 * @swagger
 * /api/story-view/list:
 *   get:
 *     summary: Get list of story views
 *     tags: [StoryView]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: story
 *         schema:
 *           type: string
 *         description: ID of the story to filter views
 *       - in: query
 *         name: isPaged
 *         schema:
 *           type: string
 *           enum: ['0', '1']
 *         description: Pagination flag (0 for all results, 1 for paginated results)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Page number for pagination
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           displayName:
 *                             type: string
 *                           avatarUrl:
 *                             type: string
 *                       story:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                 totalPages:
 *                   type: integer
 *                 totalElements:
 *                   type: integer
 */
