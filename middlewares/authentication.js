const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const createHttpError = require("http-errors");
const prisma = new PrismaClient();

module.exports = async (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization;

        if (!bearerToken) {
            return next(createHttpError(401, { message: "Token not found!" }));
        }

        const token = bearerToken.split("Bearer ")[1];

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: {
                id: payload.id,
            },
            select: {
                id: true,
                name: true,
                role: true,
                phoneNumber: true,
                familyName: true,
                auth: {
                    select: {
                        id: true,
                        email: true,
                        isVerified: true,
                    },
                },
            },
        });

        req.user = user;
        if (req.user === null) {
            return next(
                createHttpError(401, {
                    message: "Unauthorized, please re-login",
                })
            );
        }
        next();
    } catch (error) {
        if (error.message === "jwt expired") {
            return next(
                createHttpError(401, {
                    message: "JWT Token Expired",
                })
            );
        } else {
            next(
                createHttpError(500, {
                    message: error.message,
                })
            );
        }
    }
};
