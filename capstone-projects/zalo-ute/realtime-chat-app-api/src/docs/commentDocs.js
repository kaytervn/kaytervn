/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: Comment management
 */

/**
 * @swagger
 * /v1/comment/create:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comment]
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
 *                 description: ID of the post to comment on
 *               content:
 *                 type: string
 *                 description: Content of the comment
 *               parent:
 *                 type: string
 *                 description: ID of the parent comment (for replies)
 *               imageUrl:
 *                 type: string
 *                 description: URL of the attached image
 */

/**
 * @swagger
 * /v1/comment/update:
 *   put:
 *     summary: Update an existing comment
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID of the comment to update
 *               content:
 *                 type: string
 *                 description: Updated content of the comment
 *               imageUrl:
 *                 type: string
 *                 description: Updated URL of the attached image
 */

/**
 * @swagger
 * /v1/comment/get/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to retrieve
 */

/**
 * @swagger
 * /v1/comment/delete/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to delete
 */

/**
 * @swagger
 * /v1/comment/list:
 *   get:
 *     summary: Get list of comments
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: Filter comments by content
 *       - in: query
 *         name: post
 *         schema:
 *           type: string
 *         description: Filter comments by post ID
 *       - in: query
 *         name: parent
 *         schema:
 *           type: string
 *         description: Filter comments by parent comment ID
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
 *         name: ignoreChildren
 *         schema:
 *           type: string
 *         description: Set to "1" to ignore child comments
 *       - in: query
 *         name: size
 *         schema:
 *           type: number
 *         description: Number of items per page
 */
