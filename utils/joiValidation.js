const Joi = require("joi").extend(require("@joi/date"));

// auth
const LoginSchema = Joi.object({
    password: Joi.string().min(8).max(50).required(),
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            maxDomainSegments: 3,
            tlds: { allow: ["com", "net", "id"] },
        })
        .required(),
});

const RegisterSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .regex(/^(?!\s*$)[a-zA-Z\s]+$/) //will allow user to input only alphabet and won't accept if there is only blank space
        .required(),
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            maxDomainSegments: 3,
            tlds: { allow: ["com", "net", "id"] },
        })
        .required(),
    phoneNumber: Joi.string().min(11).max(13).required(),
    password: Joi.string().min(8).max(20).required(),
});

const PasswordSchema = Joi.object({
    password: Joi.string().min(8).max(30).required(),
    confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
        "any.only": "Confirm password does not match password",
    }),
});

const OTPSchema = Joi.object({
    otp: Joi.string().min(6).max(6).required(),
});

const forgetPasswordSchema = Joi.object({
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            maxDomainSegments: 3,
            tlds: { allow: ["com", "net", "id"] },
        })
        .required(),
});

// user
const userCreateSchema = Joi.object({
    name: Joi.string()
        .regex(/^(?!\s*$)[a-zA-Z\s]+$/)
        .required(),
    phoneNumber: Joi.string().min(11).max(13).optional(),
    familyName: Joi.string()
        .regex(/^(?!\s*$)[a-zA-Z\s]+$/)
        .required(),
    role: Joi.string().valid("BUYER", "ADMIN").default("BUYER"), // Set default value for role
});

const userUpdateSchema = Joi.object({
    id: Joi.string(),
    name: Joi.string().regex(/^(?!\s*$)[a-zA-Z\s]+$/),
    phoneNumber: Joi.string().optional(),
    familyName: Joi.string()
        .regex(/^(?!\s*$)[a-zA-Z\s]+$/)
        .required(),
    role: Joi.forbidden(), // Ensure role is not allowed in request body
});

// flight
const createFlightSchema = Joi.object({
    planeId: Joi.string().regex(/^[a-zA-Z0-9 /s]*$/).required(),
    departureDate: Joi.date().iso().required().messages({
        "date.format":
            '"departureDate" must be in ISO format, eg: 2024-01-07 09:30:00',
    }),
    departureAirportId: Joi.string().required(),
    arrivalDate: Joi.date().iso().required().messages({
        "date.format":
            '"arrivalDate" must be in ISO format, eg: 2024-01-07 09:30:00',
    }),
    transitAirportId: Joi.string().required(),
    transitArrivalDate: Joi.date().iso().required().messages({
        "date.format":
            '"arrivalDate" must be in ISO format, eg: 2024-01-07 09:30:00',
    }),
    transitDepartureDate: Joi.date().iso().required().messages({
        "date.format":
            '"arrivalDate" must be in ISO format, eg: 2024-01-07 09:30:00',
    }),
    destinationAirportId: Joi.string().required(),
    price: Joi.number().required(),
    capacity: Joi.number().min(2).max(850).required(),
    facilities: Joi.string(),
});

const updateFlightSchema = Joi.object({
    planeId: Joi.string().required(),
    departureDate: Joi.date().iso().required().messages({
        "date.format":
            '"departureDate" must be in ISO format, eg: 2024-01-07 09:30:00',
    }),
    departureAirportId: Joi.string().required(),
    arrivalDate: Joi.date().iso().required().messages({
        "date.format":
            '"arrivalDate" must be in ISO format, eg: 2024-01-07 09:30:00',
    }),
    transitAirportId: Joi.string().required(),
    transitArrivalDate: Joi.date().iso().required().messages({
        "date.format":
            '"arrivalDate" must be in ISO format, eg: 2024-01-07 09:30:00',
    }),
    transitDepartureDate: Joi.date().iso().required().messages({
        "date.format":
            '"arrivalDate" must be in ISO format, eg: 2024-01-07 09:30:00',
    }),
    destinationAirportId: Joi.string().required(),
    price: Joi.number().required(),
    capacity: Joi.number().min(2).max(850).required(),
    facilities: Joi.string(),
});

// ticket
const TicketSchema = Joi.object({
    flightId: Joi.string().required(),
    userId: Joi.string().required(),
    seatId: Joi.string().required(),
    bookingDate: Joi.date()
        .required()
        .greater(Date.now() - 24 * 60 * 60 * 1000),
});

const UpdateTicketSchema = Joi.object({
    code: Joi.string(),
    bookingDate: Joi.date().greater(Date.now() - 24 * 60 * 60 * 1000),
});

// flightSeat
const createFlightSeatSchema = Joi.object({
    flightId: Joi.string().required(),
    seatNumber: Joi.string().min(2).max(4).required(),
    type: Joi.string().valid("ECONOMY", "BUSINESS", "FIRST").required(),
});

// Airline
const createAirlineSchema = Joi.object({
    name: Joi.string()
        .min(6)
        .max(20)
        .regex(/^(?!\s*$)[a-zA-Z\s]+$/)
        .required(),
    code: Joi.string().min(2).max(2).required(),
});

const updateAirlineSchema = Joi.object({
    name: Joi.string()
        .min(6)
        .max(20)
        .regex(/^(?!\s*$)[a-zA-Z\s]+$/),
    code: Joi.string().min(2).max(2),
});

// Airport
const createAirportSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(70)
        .regex(/^(?!\s*$)[a-zA-Z\s]+$/)
        .required(),
    code: Joi.string().min(3).max(3).required(),
    country: Joi.string()
        .regex(/^(?!\s*$)[a-zA-Z\s]+$/)
        .required(),
    city: Joi.string()
        .regex(/^(?!\s*$)[a-zA-Z\s]+$/)
        .required(),
});

const updateAirportSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(70)
        .regex(/^(?!\s*$)[a-zA-Z\s]+$/),
    code: Joi.string().min(3).max(3),
    country: Joi.string()
        .min(3)
        .max(25)
        .regex(/^(?!\s*$)[a-zA-Z\s]+$/),
    city: Joi.string()
        .min(3)
        .max(40)
        .regex(/^(?!\s*$)[a-zA-Z\s]+$/),
});

module.exports = {
    LoginSchema,
    RegisterSchema,
    OTPSchema,
    createFlightSchema,
    updateFlightSchema,
    PasswordSchema,
    forgetPasswordSchema,
    userCreateSchema,
    userUpdateSchema,
    createFlightSeatSchema,
    createAirlineSchema,
    updateAirlineSchema,
    createAirportSchema,
    updateAirportSchema,
    TicketSchema,
    UpdateTicketSchema,
};
