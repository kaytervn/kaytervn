/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and authentication
 */

/**
 * @swagger
 * /v1/user/login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's email, phone, or studentId
 *               password:
 *                 type: string
 *                 description: User's password
 */

/**
 * @swagger
 * /v1/user/verify-token:
 *   post:
 *     summary: Verify user token
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accessToken:
 *                 type: string
 *                 description: User's access token
 */

/**
 * @swagger
 * /v1/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /v1/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               studentId:
 *                 type: string
 */

/**
 * @swagger
 * /v1/user/verify:
 *   post:
 *     summary: Verify user account
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 */

/**
 * @swagger
 * /v1/user/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               otp:
 *                 type: string
 */

/**
 * @swagger
 * /v1/user/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 */

/**
 * @swagger
 * /v1/user/update-profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               bio:
 *                 type: string
 *               avatarUrl:
 *                 type: string
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 */

/**
 * @swagger
 * /v1/user/delete/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */

/**
 * @swagger
 * /v1/user/list:
 *   get:
 *     summary: Get list of users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: displayName
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: number
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: size
 *         schema:
 *           type: number
 *       - in: query
 *         name: ignoreFriendship
 *         schema:
 *           type: string
 *       - in: query
 *         name: ignoreConversation
 *         schema:
 *           type: string
 */

/**
 * @swagger
 * /v1/user/get/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */

/**
 * @swagger
 * /v1/user/create:
 *   post:
 *     summary: Create a new user (admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               studentId:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               bio:
 *                 type: string
 *               avatarUrl:
 *                 type: string
 *               status:
 *                 type: number
 *               role:
 *                 type: string
 */

/**
 * @swagger
 * /v1/user/update:
 *   put:
 *     summary: Update user (admin only)
 *     tags: [User]
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
 *               displayName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               studentId:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               bio:
 *                 type: string
 *               avatarUrl:
 *                 type: string
 *               status:
 *                 type: number
 *               role:
 *                 type: string
 *               password:
 *                 type: string
 */

/**
 * @swagger
 * /v1/user/login-admin:
 *   post:
 *     summary: Admin login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 */

/**
 * @swagger
 * /v1/user/request-key-change:
 *   post:
 *     summary: Request to change key information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */

/**
 * @swagger
 * /v1/user/verify-key-change:
 *   post:
 *     summary: Verify key information change
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               studentId:
 *                 type: string
 *               phone:
 *                 type: string
 *               otp:
 *                 type: string
 */
