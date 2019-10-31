import app from './app';
import { environment } from './environments/environment';
const PORT = environment.schnackPort;

app.listen(PORT, () => {
    console.log(new Date() + ' Express server listening on port ' + PORT);
});
