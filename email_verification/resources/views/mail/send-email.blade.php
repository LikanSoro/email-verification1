<x-mail::message>
# Email verification
<h4>Hi {{ $user->username}}</h4>
Please click the link below to verify your email.
<a href="{{route('verify', ['email' => $user->email, 'verifyToken' => $user->verify_token])}}">Click here</a>

Thanks,<br>
{{ $user->username}}
</x-mail::message>
