/**
 * @swagger
 * tags:
 *   name: Message
 *   description: Message management
 */

/**
 * @swagger
 * /v1/message/create:
 *   post:
 *     summary: Create a new message
 *     tags: [Message]
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
 *               content:
 *                 type: string
 *                 description: Content of the message
 *               parent:
 *                 type: string
 *                 description: ID of the parent message (for replies)
 *               imageUrl:
 *                 type: string
 *                 description: URL of the attached image
 */

/**
 * @swagger
 * /v1/message/update:
 *   put:
 *     summary: Update an existing message
 *     tags: [Message]
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
 *                 description: ID of the message to update
 *               content:
 *                 type: string
 *                 description: Updated content of the message
 *               imageUrl:
 *                 type: string
 *                 description: Updated URL of the attached image
 */

/**
 * @swagger
 * /v1/message/get/{id}:
 *   get:
 *     summary: Get a message by ID
 *     tags: [Message]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the message to retrieve
 */

/**
 * @swagger
 * /v1/message/delete/{id}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Message]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the message to delete
 */

/**
 * @swagger
 * /v1/message/list:
 *   get:
 *     summary: Get list of messages
 *     tags: [Message]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: Filter messages by content
 *       - in: query
 *         name: parent
 *         schema:
 *           type: string
 *         description: Filter messages by parent message ID
 *       - in: query
 *         name: conversation
 *         schema:
 *           type: string
 *         description: Filter messages by conversation ID
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
