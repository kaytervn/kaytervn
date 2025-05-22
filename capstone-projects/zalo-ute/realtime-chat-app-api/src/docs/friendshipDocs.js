/**
 * @swagger
 * tags:
 *   name: Friendship
 *   description: Friendship management
 */

/**
 * @swagger
 * /v1/friendship/send:
 *   post:
 *     summary: Send a friend request
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: ID of the user to send friend request to
 *     responses:
 *       200:
 *         description: Friend request sent successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/friendship/accept:
 *   put:
 *     summary: Accept a friend request
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               friendship:
 *                 type: string
 *                 description: ID of the friendship to accept
 *     responses:
 *       200:
 *         description: Friend request accepted successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/friendship/reject:
 *   put:
 *     summary: Reject a friend request
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               friendship:
 *                 type: string
 *                 description: ID of the friendship to reject
 *     responses:
 *       200:
 *         description: Friend request rejected successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/friendship/list:
 *   get:
 *     summary: Get list of friendships
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: getListKind
 *         schema:
 *           type: string
 *       - in: query
 *         name: displayName
 *         schema:
 *           type: string
 *         description: Filter by display name
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
 *         description: List of friendships retrieved successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/friendship/delete/{id}:
 *   delete:
 *     summary: Delete a friendship
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the friendship to delete
 *     responses:
 *       200:
 *         description: Friendship deleted successfully
 *       400:
 *         description: Bad request
 */
