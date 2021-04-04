import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { User } from '~/entity/User';
import HttpException from '~/exceptions/HttpException';

const LocalStrategy = passportLocal.Strategy;

function localStart() {
	passport.use(
		'login-strategy',
		new LocalStrategy(
			{ usernameField: 'email' },
			async (email, password, done) => {
				const user = await User.findOne({ email });
				if (!user) {
					return done(new HttpException(409, 'Email address not found.'));
				}

				await bcrypt.compare(password, user.password, (err, isMatch) => {
					if (err) {
						done(err);
					}

					if (isMatch) {
						return done(null, user);
					} else {
						return done(
							new HttpException(401, 'Email or Password is incorrect.')
						);
					}
				});
			}
		)
	);
}

export default localStart;
