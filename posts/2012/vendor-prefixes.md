    title: Vendor Prefixes - A Compromise
    date: 2012-08-24
    tags: css html javascript vendor prefixes experimental
    issue: 6

### Vendor Prefixes: Good / Bad?

Vendor prefixes rock and suck at the same time. They allow browser vendors to experiment with new features and gather feedback from developers both for the implementation and the standard. This is Good(TM). The problem is they are experimental by nature, the features they expose are subject to change and the prefixed version is supposed to die when the feature is standardized and the implementation is no longer experimental.

### But That's Not How It Works

What happens is that websites out there start to *rely* on these features, worse even, they often rely on the prefixed version and the final version may actually even behave differently. If you drop the prefixes at that point, websites out there start looking like crap, or might even break functionally.

Evangelism helps, but it hardly fixes the problem, just ask Opera. What's the solution? We are likely to end up with bad APIs if we can't experiment with implementations before the APIs are made available. But the other alternative seems to be fragmentation of the web.

### A Compromise

Here's the important part, so listen up. There's a way we can get the best of both worlds. As said, vendor prefixes, by nature, signify experimental features. They aren't supposed to be used in production or exposed to the masses, but instead they're there so that developers can try the new APIs out. So what about this:

Vendor prefixes _NEVER_ land in stable builds of browsers. Most browsers let people already use *experimental* versions of the browsers already, why not confine these *experimental* features to those *experimental* browsers? The target audience of vendor prefixes are likely to be already using those versions of the browsers.

What do you think?
