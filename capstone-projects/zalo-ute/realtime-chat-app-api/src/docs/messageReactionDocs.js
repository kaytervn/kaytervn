/**
 * @swagger
 * tags:
 *   name: MessageReaction
 *   description: Message reaction management
 */

/**
 * @swagger
 * /v1/message-reaction/create:
 *   post:
 *     summary: Create a new message reaction
 *     tags: [MessageReaction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: ID of the message to react to
 */

/**
 * @swagger
 * /v1/message-reaction/delete/{id}:
 *   delete:
 *     summary: Delete a message reaction
 *     tags: [MessageReaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the message to remove reaction from
 */

/**
 * @swagger
 * /v1/message-reaction/list:
 *   get:
 *     summary: Get list of message reactions
 *     tags: [MessageReaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: message
 *         schema:
 *           type: string
 *         description: ID of the message to get reactions for
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
