import express, { Request, Response, NextFunction } from 'express'

export function catchError(res: express.Response) {
  return (error: any) => res.status(500).json({ error: String(error) })
}

export function wrapControllerMethod<T>(fn: (req: Request) => T) {
  return async (req: Request, res: Response) => {
    try {
      let json = await fn(req)
      res.json(json)
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json({ error: error.message })
      } else {
        res.status(500).json({ error: String(error) })
      }
    }
  }
}

export class HttpError extends Error {
  constructor(public status: number, public message: string) {
    super(message)
  }
}

export function parseParamsAsInt(req: Request, field: string) {
  if (!(field in req.params)) {
    throw new HttpError(400, `Missing ${field} in req.params`)
  }
  let int = +req.params[field]
  if (!Number.isInteger(int)) {
    throw new HttpError(400, `Invalid ${field} in req.params`)
  }
  return int
}
