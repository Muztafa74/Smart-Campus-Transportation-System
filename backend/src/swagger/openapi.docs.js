/**
 * Smart Campus Transportation — OpenAPI fragments for swagger-jsdoc.
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *     ValidationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               message:
 *                 type: string
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         fullName:
 *           type: string
 *         role:
 *           type: string
 *           enum: [FACULTY, DISABLED, ADMIN]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *     Gate:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     Car:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         plateNumber:
 *           type: string
 *         model:
 *           type: string
 *         seats:
 *           type: integer
 *         isAvailable:
 *           type: boolean
 *     Trip:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         status:
 *           type: string
 *           enum: [PENDING, ASSIGNED, IN_PROGRESS, COMPLETED]
 *         fromGate:
 *           $ref: '#/components/schemas/Gate'
 *         toGate:
 *           $ref: '#/components/schemas/Gate'
 *         digit:
 *           type: integer
 *           nullable: true
 *           description: Route digit copied from GatePath at booking time
 *         car:
 *           oneOf:
 *             - $ref: '#/components/schemas/Car'
 *             - type: 'null'
 *         user:
 *           $ref: '#/components/schemas/User'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Health check
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 */

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register (FACULTY or DISABLED only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, full_name, role]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               full_name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [FACULTY, DISABLED]
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: List all users (ADMIN)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @openapi
 * /api/users/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Update user (ADMIN)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [FACULTY, DISABLED, ADMIN]
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 *   delete:
 *     tags: [Users]
 *     summary: Delete user (ADMIN)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Not found
 */

/**
 * @openapi
 * /api/trips/request:
 *   post:
 *     tags: [Trips]
 *     summary: Request a trip (start gate → destination gate)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fromGateId, toGateId, carId]
 *             properties:
 *               fromGateId:
 *                 type: string
 *                 description: MongoDB ObjectId of the start / pickup gate
 *               toGateId:
 *                 type: string
 *                 description: MongoDB ObjectId of the destination gate
 *               carId:
 *                 type: string
 *                 description: MongoDB ObjectId of an available vehicle (see GET /api/cars/available)
 *     responses:
 *       201:
 *         description: Trip created (ASSIGNED with chosen vehicle)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trip:
 *                   $ref: '#/components/schemas/Trip'
 *       400:
 *         description: Validation error or no GatePath for this start→destination
 *       404:
 *         description: Gate or vehicle not found
 *       409:
 *         description: Selected vehicle no longer available
 */

/**
 * @openapi
 * /api/trips/my:
 *   get:
 *     tags: [Trips]
 *     summary: List my trips
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trips:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trip'
 */

/**
 * @openapi
 * /api/trips:
 *   get:
 *     tags: [Trips]
 *     summary: List all trips (ADMIN)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trips:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trip'
 */

/**
 * @openapi
 * /api/trips/{id}/status:
 *   patch:
 *     tags: [Trips]
 *     summary: Update trip status (ADMIN) — IN_PROGRESS or COMPLETED
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [IN_PROGRESS, COMPLETED]
 *     responses:
 *       200:
 *         description: Updated
 *       400:
 *         description: Invalid transition
 *       404:
 *         description: Trip not found
 */

/**
 * @openapi
 * /api/cars/available:
 *   get:
 *     tags: [Cars]
 *     summary: List vehicles available to book (any authenticated user)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cars:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Car'
 */

/**
 * @openapi
 * /api/cars:
 *   get:
 *     tags: [Cars]
 *     summary: List cars (ADMIN)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cars:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Car'
 *   post:
 *     tags: [Cars]
 *     summary: Create car (ADMIN)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [plateNumber]
 *             properties:
 *               plateNumber:
 *                 type: string
 *               model:
 *                 type: string
 *               seats:
 *                 type: integer
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Created
 *       409:
 *         description: Duplicate plate
 */

/**
 * @openapi
 * /api/cars/{id}:
 *   patch:
 *     tags: [Cars]
 *     summary: Update car (ADMIN)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plateNumber:
 *                 type: string
 *               model:
 *                 type: string
 *               seats:
 *                 type: integer
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 *   delete:
 *     tags: [Cars]
 *     summary: Delete car (ADMIN)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Not found
 */

/**
 * @openapi
 * /api/gates:
 *   get:
 *     tags: [Gates]
 *     summary: List gates (authenticated)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gates:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Gate'
 *   post:
 *     tags: [Gates]
 *     summary: Create gate (ADMIN)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       409:
 *         description: Duplicate name
 */

/**
 * @openapi
 * /api/gates/{id}:
 *   patch:
 *     tags: [Gates]
 *     summary: Update gate (ADMIN)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 *   delete:
 *     tags: [Gates]
 *     summary: Delete gate (ADMIN)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Not found
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     GatePath:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         fromGate:
 *           $ref: '#/components/schemas/Gate'
 *         toGate:
 *           $ref: '#/components/schemas/Gate'
 *         digit:
 *           type: integer
 *           minimum: 0
 */

/**
 * @openapi
 * /api/paths:
 *   get:
 *     tags: [Paths]
 *     summary: List gate-to-gate paths (ADMIN)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paths:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GatePath'
 *   post:
 *     tags: [Paths]
 *     summary: Create path from gate A to gate B with digit (ADMIN)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fromGateId, toGateId, digit]
 *             properties:
 *               fromGateId:
 *                 type: string
 *               toGateId:
 *                 type: string
 *               digit:
 *                 type: integer
 *                 minimum: 0
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Same from/to or invalid gates
 *       409:
 *         description: Path already exists
 */

/**
 * @openapi
 * /api/paths/{id}:
 *   patch:
 *     tags: [Paths]
 *     summary: Update path (ADMIN)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromGateId:
 *                 type: string
 *               toGateId:
 *                 type: string
 *               digit:
 *                 type: integer
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 *   delete:
 *     tags: [Paths]
 *     summary: Delete path (ADMIN)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Not found
 */

module.exports = {};
