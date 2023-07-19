# Dependency Management, and Reflections on Amazon's codebase

This is not primarily about Amazon, or my reasons for departure. Departing has
given me a reason to do some reflections after working on a massive polyglot
enterprise codebase that I'd really like to share.

In 2020 I joined a fledgling area of Amazon that was later called "Code
Foundations." (There were many name changes of organizations and teams during
this time, but the full history would be longer and less useful.) I really
enjoyed my time trying to push forward software development at Amazon, and
just make it better. It's hard to see the progress of something so enormous
sometimes, but I absolutely did make measurable progress. In the best cases,
the changes were so seamless and uneventful that no noticed. Problems just
went away and were forgotten, or things that were slow got faster.

I'm writing the first draft of this almost 3 years later to the day, in the
summer of 2023. I've resigned my position at Amazon, and of course, none of
my opinions expressed here are opinions of Amazon or Amazon Web Services or
related business entities.

# What Amazon kinda-sorta looks like from the deepest levels

I've spent the last 3 years up to my eyeballs in Amazon's and AWS's codebases.
Polyglot, primarily Linux-based, primarily developed on Macs (Linux for me),
nearly everything in the codebase is built from scratch starting from C
libraries, with many sub-ecosystems based on languages and disciplines present.

There are also two major internal 1p code bases with their own ideas of
package/dependency management. The older code base predates Maven Central and
for its time is a marvel of engineering. I can't imagine the original authors
could have anticipated it scaling up to serve more than 575,000 software
projects across domains ranging from Web Sites and Web Services to Avionics
and satellites. The newer code base is still ramping up, but is built to scale
and embraces idiomatic solutions far beyond the prior solution's attempt. There
are also some off-the-grid solutions that either come from very weird use cases
or from subsidiaries that had different tech stacks before joining the Amazon
family.

The code base in Amazon is primarily Java and Java-based languages, with Python
and JavaScript making up the next-largest chunks. The older parts of the code
base embraced C and C++ with Perl as a scripting language. Java is the status
quo for 60~80% of software (depends if you measure by builds, deployments,
commit velocity, or something else) and its usage, along with related languages
like is Kotlin, is growing, but interestingly other languages are
proportionately growing faster.

This all serves >575k software projects (each have thousands of dependencies)
from bread-and-butter Java servers to weird stuff like aviation and satellite
software.

My role here was varied, sometimes it was incident response for security
incidents, oftentimes it was ecosystem management, sometimes it was integrating
new languages or build tools. A few times it was to make changes deep in the
tree of dependencies, which [Hyrum's law](https://www.hyrumslaw.com) can give
an idea of, but is really one of those things that must be experienced to
[really, truly understand](https://xkcd.com/1172). Other times my role was more
focused and specialized, like building out more support for ARM development.

# Opportunities in dependency management

The previous section is only to motivate that I might have something to say
here.

Many times the discussions of dependency management, or "dependency engineering"
as one writer has recently put it, only go as deep as
"[the diamond problem](https://en.wikipedia.org/wiki/Multiple_inheritance#The_diamond_problem)"
or other talk about version conflicts and which version to choose when two+
things want different versions of the same thing. These are kind of the
"missing semicolon" problems of dependency management. They're minor annoyances,
and occasionally they might cause a hard problem, but they're also kind of the
baby steps into the space.

> Note: The best mature discussion of dependency management, for my money, is
part of Rich Hickey's [Spec-ulation Keynote](https://www.youtube.com/watch?v=oyLBGkS5ICk)
from Clojure/conj 2016. Some ideas here are absolutely building on his
observations there.
>
> There are many other interesting articles and war stories told of dependency
management, and of course I have my own experiences. I'm convinced right now,
though, that dependency management is a largely unexplored field. It's sort of
like build systems which I think has just [a single good research paper](https://www.microsoft.com/en-us/research/publication/build-systems-a-la-carte/).

## Dependency management can't be (only) about versions

I think the most critical part of whatever will bring sanity to dependency
management can not think in terms of "versions," whatever that actually means.
A version is simply not enough information to do what dependency management
must do. Versions are tags, they're partially about sequential ordering, but
primarily about humans trying to communicate intent of changes.

In versions, bigger numbers are more recent and better -- maybe even more
secure! If they're not security related, they might be indirectly if something
security related also requires it. If you have _many numbers_ it gives a
project a feeling of maturity. If you have a `0.x.x` version, it suggests you
are a Rust developer who's trying to avoid commitment. If a project has
scheduled release dates for versions, then version numbers are more like
ticking time bombs that roughly map to a point in time when your code can no
longer get security updates, and possibly becomes incapable of keeping up
with an entire ecosystem.

Semantic versioning (semver) was helpful. [Ryan Schmidt](https://github.com/rschmitt),
who I had the pleasure of occasionally working with while at Amazon, once
remarked that the primary contribution of semver was simply being a meme that
made people think about what a version can convey. (He put it better and more
succinctly)

I also think it's the best scheme around, and we should probably all adopt it.
If you don't (I don't always) then do make sure to document the versioning
scheme. I think we're moving towards a world where semver might be assumed. In
some newer ecosystems, it absolutely is assumed. Sometimes it's even enforced
by a community in the form of issues and complaints.

Semver is not a silver bullet though. At best you can communicate "The artifact
as a whole is not compatible with a previous version. (I think.)" on a major
version bump. "I think this shouldn't break anyone" is roughly the minor and
patch version changes. None of these can really be checked though I've seen
some valiant attempts on the software vendor side. It's really the consumers
that need to know, though, and they need package managers to be telling them.

Even a bugfix is breaking [to somebody](https://xkcd.com/1172). Even making
everyone's code run faster can cause problems, especially if that code is used
in something like a microservice that calls another microservice and there
isn't proper throttling controls. (Ask me how I know!)

**A version can't convey whether any code _that your project uses_ has or
hasn't changed.** Maybe a changelog can, or commit messages. A version
especially cannot determine if a change is good or bad for you. It can't make
the judgement call on a CVE, for example, on whether you're going to need to
page _everybody_, or whether your whole company doesn't even use the thing in a
meaningful way. At Amazon, I even learned that [both of those can be sort of
true at the same time](https://www.youtube.com/watch?v=pkPkm7W6rGg&t=2031s&pp=ygUJbG9nNGogYXdz)!
(Everyone had to patch Log4j2, but also no one at Amazon even needed the
vulnerable feature; Ryan patched it out.)

Anyway, at the end of the day, to understand a version, you have to trust the
maintainers of your dependencies to communicate effectively. You also have to
trust yourself (or teammates or whatever) to properly interpret it. It's all a
house of cards trust system with humans who make errors. Trust systems work to
an extent, but only to an extent.

Of course, it all works better in small doses. C and C++ devs might be on to
something with a lack of a single standard package manager, and a tendency to
write a lot from scratch. (Unless it comes from Boost.) Chuck Moore's seeming
ability to think in [144 dimensions](https://www.youtube.com/watch?v=0PclgBd6_Zs)
may come from similar freedoms. Then again... these projects can also be
sensitive to change and age poorly!

# What do we really need in dependency management?

At the end of the day, taking a dependency is really about getting a subset of
code from a codebase.

We need to be upgrading over time; software upgrades costs more in the future
than they do today. I can't quite articulate this concisely yet, and still need
a few more hours rambling over drinks to really solidify my elevator pitch.
There are a lot of reasons here, but the general gist is that if you have a
dependency, it's really convenient to use more of it than you already do, and
everyone in your dependency tree has a similar incentive to bind more tightly
over time to dependencies. Some percent of those relationships are binding more
tightly to the tree as it exists, and slowly putting out roots that are much
harder to prune than branches. If all of the system is not being renewed, then
it's ossifying. (Or when God is merciful: simply being stable.)

The effects of ossification are smaller when considering an individual piece
of software, but these effects are visceral when you work on something the
size of Amazon. (Package maintainers for Linux and BSD distributions know this
too.) When working on something the size of Maven or NPM or PyPI, I think the
only solution these days is to treat the ecosystem as an ecosystem where some
stuff is going to be too weak and die, and other stuff is going to adapt and
breed and carry on a legacy. (Or: the market will pick the winners and losers.)

Anyway, some of the big missing features in dependency management systems are:

## 1. Update when nothing has changed

If there is no change _in the actual code paths being used,_ they must be
updated without any other consideration. I don't care if the major version
bumped seven times if I didn't use anything that got updates.

### But metadata is lacking

All dependency systems I'm familiar with lack the metadata on what actually
changes from version to version for vended libraries, and also lack the
metadata on what is being used from a vended library by its consuming software.
In most cases, we lack even basic metadata on the what is exposed _at all_ from
a library: the values, functions and their signatures, interfaces, structs, and
more. I don't think it's impossible to capture these. In the weirdest cases, we
can capture these relationships between callee and caller at the time of
consumption only.

This must be a deep traversal of the call paths through many dependencies, all
of which can be potentially considered for updates. This is not a trivial
problem, but it's also not unsolvable. It might not be something you want to
run on every build, but maybe as a background process that only runs every _X_
for some acceptable value of _X_.

Evaluating the metadata, if it exists, is well-suited for a logic programming
style solution that unifies with a bias towards recency... if only the metadata
was available!

> **Note**: I've been informed that Blaze, Bazel, and Buck all have this as
part of their strategy. Thanks Aaron Sheldon, I need to get out of my cave.

### And there are gotchas

"Update when nothing changed" can only ever rise to an imperfect solution, but
I think it can cover a majority of cases. Here are some places where it will
struggle:

Anything using preprocessing must be considered _after_ the preprocessing is
complete. In some languages, the compiler or execution environment will have
effects on what is generated and what isn't. (`#ifdef` and `comptime if` come
to mind.) Anything using reflection or `eval()` functions should probably be
considered _sus_, but I've seen is generally reserved either for the lowest- or
highest-level code. It's rarer to see substantial reflection in the middle of a
dependency graph. Reflection includes deserialization into values, although not
necessarily the deserialization dependencies. `#derive[...]` in Rust, for
example, comes from the language itself, not from the myriad of uses in every
crate ever published.

License changes, of course, must be considered. Usually a mature business
entity will know what kind of licenses it cares about, and what kinds it does
not. Licenses don't change often for particular projects, more often these come
from dependency tree changes when a dependency substitutes or introduces new
transitive dependencies that didn't exist before.

### Really though

We must update. On this point of "the code you call never changed," I don't
care about your dependency ranges, your major version semantics, and especially
not about your lock files. If we can be reasonably confident that there's no
change in any _code_ that you actually depend on, update it right away.

The fun part after we have this, is starting to understand how we define update
rules when the code we call did change in some way, and find out how to also
automate those upgrades too. OpenRewrite is paving a very interesting path here
too.

## 2. See number 1, and other thoughts

There is no other pressing matter in dependency management as urgent in my mind
as actually performing upgrades. Automating an understanding of compatibility
of potential upgrades (Above sort of hand-waved as "metadata") is a step
towards getting there.

### Other actual issues

1. Why do we even use so many dependencies? Can't we reduce this over time? The
   value in good software design is when "classes are deep." We should abstract
   more complexity away, and should have simpler interfaces over time if we're
   really improving. (See: Ousterhout's _A Philosophy of Software Design_) CPU
   clock speeds have gone from being measured in MHz to GHz -- literally
   thousands of times faster -- but [basic latency of displaying a character
   after a keystrokes is getting slower](https://danluu.com/input-lag/) and I
   think this has to do with too many layers of low-value software and too many
   dependencies.

2. Visibility and telemetry. We need a solution for understanding what software
   is used, how, and where. We need to know the version, too. The answer must
   not involve spying on end users, as spying can always be misuesed. What is
   the most important software today? The Linux kernel? C? SQLite? Python?
   Bash? How do we even approximate something that could help us understand a
   top ten list? And once we understand, are we prepared to know how horribly
   out of date, and vulnerable to technical attacks, our societies are?
   Governments and corporations should also wonder.

3. How do we ever begin to build trust in software? Signatures are... a step.
   Reproducible builds are also a step.

# Closing

When all is said and done, I think we'll get there. I think we'll figure out
how to make it all work, and get move on to just building software and not spending
so much time figuring out out supply chain and all this stuff. Dependency
management has some hard problems, but I don't think they're unsolvable
problems. [I believe in you](https://www.youtube.com/watch?v=IP8JgWd6TW0).

Wow, did anyone read all of this? If so, please take a break, this was pretty
stream-of-consciousness and rambly. Let's grab a drink or chat sometime on why
it matters to you.

