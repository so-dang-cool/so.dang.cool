I'm working on [kamajii](https://github.com/hiljusti/kamajii) and keep
changing the language (currently, many branches).

Mostly my needs with a proof of concept are to have a good TCP and
file I/O experience.

What I've been feeling so far:

- Haskell is attractive, but IO is painful. There's maybe some library
  I could introduce with some abstractions here, but I'm not sure I'm
  ready with a much better idea yet. It's possible to work at a low
  level with file handles, or at a higher level with file/directory
  names. The former is tedious, and often feels like C would be faster.
  Or maybe I'm just frustrated... The latter leads to issues when
  ordering is important: open a file, read a value, then write back.
  Trivial if you have a file handle, but complex if reading the file
  starts a lock that isn't released before you prepare writing. (Yay
  for non-strictness! But I don't like it for file IO.)

- Rust would be exciting to write, but plain TCP is fiddly. Lots of
  bytes and buffers and such. (Zig is similar atm, but at a lower
  level and less of an ecosystem.) Other platforms in Rust might be
  worth exploring but... Maybe not quite yet.

- Erlang and Elixir appear to be wonderful candidates for a "many
  clients" situation. That said, [cowboy](https://github.com/ninenines/cowboy)
  seemed cool, but like a deep investment. [`gen_tcp`](https://erlang.org/doc/man/gen_tcp.html)
  is an option worth more exploration.

- Crystal impressed me with a really slick and intuitive "it's just
  a stream of characters, basically" implementation. Doing actual
  file handling is verbose (compared to other Ruby things) but not the
  worst. Abstraction can help here.

There are other considerations I suspect I'll have in the future, like:

- make a custom file format for efficient packing

- caching in memory and offloading to disk asynchronously

- who actually wants to use this? (I have ideas)

