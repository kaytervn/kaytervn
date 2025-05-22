/**
 * @swagger
 * tags:
 *   name: Conversation
 *   description: Conversation management
 */

/**
 * @swagger
 * /v1/conversation/create:
 *   post:
 *     summary: Create a new conversation
 *     tags: [Conversation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the conversation (for group chats)
 *               avatarUrl:
 *                 type: string
 *                 description: URL of the conversation avatar (for group chats)
 *               conversationMembers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of user IDs to be added to the conversation
 *     responses:
 *       200:
 *         description: Conversation created successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/conversation/update:
 *   put:
 *     summary: Update an existing conversation
 *     tags: [Conversation]
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
 *                 description: ID of the conversation to update
 *               name:
 *                 type: string
 *                 description: New name for the conversation
 *               avatarUrl:
 *                 type: string
 *                 description: New avatar URL for the conversation
 *     responses:
 *       200:
 *         description: Conversation updated successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/conversation/get/{id}:
 *   get:
 *     summary: Get a conversation by ID
 *     tags: [Conversation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the conversation to retrieve
 *     responses:
 *       200:
 *         description: Conversation retrieved successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/conversation/delete/{id}:
 *   delete:
 *     summary: Delete a conversation
 *     tags: [Conversation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the conversation to delete
 *     responses:
 *       200:
 *         description: Conversation deleted successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/conversation/list:
 *   get:
 *     summary: Get list of conversations for the current user
 *     tags: [Conversation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter conversations by name
 *       - in: query
 *         name: kind
 *         schema:
 *           type: number
 *         description: Filter conversations by kind (1 for group, 2 for direct)
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
 *     responses:
 *       200:
 *         description: List of conversations retrieved successfully
 *       400:
 *         description: Bad request
 */
