/**
 * @swagger
 * tags:
 *   name: ConversationMember
 *   description: Conversation member management
 */

/**
 * @swagger
 * /v1/conversation-member/add:
 *   post:
 *     summary: Add a member to a conversation
 *     tags: [ConversationMember]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conversation:
 *                 type: string
 *                 description: ID of the conversation
 *               user:
 *                 type: string
 *                 description: ID of the user to be added
 *     responses:
 *       200:
 *         description: Member added to conversation successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/conversation-member/remove/{id}:
 *   delete:
 *     summary: Remove a member from a conversation
 *     tags: [ConversationMember]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the conversation member to remove
 *     responses:
 *       200:
 *         description: Member removed from conversation successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/conversation-member/list:
 *   get:
 *     summary: Get list of members in a conversation
 *     tags: [ConversationMember]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: conversation
 *         schema:
 *           type: string
 *         description: ID of the conversation
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
 *         description: List of conversation members retrieved successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/conversation-member/grant:
 *   put:
 *     summary: Grant permissions to a conversation member
 *     tags: [ConversationMember]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conversationMember:
 *                 type: string
 *                 description: ID of the conversation member
 *               canMessage:
 *                 type: number
 *                 enum: [0, 1]
 *                 description: Permission to send messages
 *               canUpdate:
 *                 type: number
 *                 enum: [0, 1]
 *                 description: Permission to update conversation
 *               canAddMember:
 *                 type: number
 *                 enum: [0, 1]
 *                 description: Permission to add members
 *     responses:
 *       200:
 *         description: Permissions granted successfully
 *       400:
 *         description: Bad request
 */
