import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) { }

    async signIn(email: string, pass: string): Promise<any> {
        try {
            const user = await this.userService.findByEmail(email);
            if (!user) {
                throw new UnauthorizedException(`User not found`);
            }
            const isMatch = await bcrypt.compare(pass, user.password.toString());
            if (!isMatch) {
                throw new UnauthorizedException('Incorrect Password');
            }
            const payload = { sub: user._id, username: user.name };
            return {
                access_token: await this.jwtService.signAsync(payload),
                id: user._id
            };
        } catch (error) {
            return new UnauthorizedException('Error authorizing user:', error);
        }

    }


}
