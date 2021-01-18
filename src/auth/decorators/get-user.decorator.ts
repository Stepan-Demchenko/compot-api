import { createParamDecorator } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

const GetUser = createParamDecorator(
  (data, req): User => {
    return req.user;
  },
);
