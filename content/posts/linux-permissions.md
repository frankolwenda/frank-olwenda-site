---
title: "Linux Permissions"
date: 2026-07-12
tags: ["linux", "security", "fundamentals"]
summary: "A practical walkthrough of Linux file permissions — read, write, execute, octal notation, and how to use chmod in both symbolic and numeric mode."
---

## What Are Linux Permissions?

Permissions are fundamental to Linux security — they govern who (or what) can
access certain files, as well as what they can do with them. File
permissions in Linux are designed to be simple; however, this simplicity can
cause issues when misconfigured or neglected altogether.

## Which Kinds of Linux Permissions Do We Have?

In Linux we have three basic permissions:

- **read (r): 4** — Read permissions let us access a file's contents, i.e.
  we can view a file that has read permissions.
- **write (w): 2** — Write permissions allow us to modify the contents of a
  file, as well as carry out other functions such as copying, moving, or
  creating a file in a directory.
- **execute (x): 1** — Execute permissions let us run a particular file.
  Some examples would be bash scripts, executable files, etc.

Note that I've put numbers beside each type of permission — these are the
octal values for each permission. Personally, I prefer to use the octal
system when assigning permissions, as I find it to be a bit quicker.

## How Do We Interpret Permissions?

In the directory of our choice, we simply use:

```bash
ls -l
```

This command does a long listing of all of the files in our directory.

![`ls -l` output showing file permissions, owner, and group](/images/posts/linux-permissions-ls.png)

Let's interpret the image above. We have different components that are
helpful for getting permissions information from our long listing. They
include:

- **File Type**: `-`
- **Permission Settings**: `---------`, or as per our image, `rw-r--r--`
- **User Owner**: `frank`
- **Group Owner**: `frank`

For reference, full permissions would give us `rwxrwxrwx`. The first `rwx`
are the permissions for a user, the second `rwx` are the permissions for a
group, and the third `rwx` are the permissions for others.

## Octal Values

Linux file permissions can be represented by numbers. These numbers are as
per the octal system (0–7).

Let's take an example where a permission of `764` is granted to a file:

- **7** — This represents the user, and the user can read, write, and
  execute the file: `4 (read) + 2 (write) + 1 (execute)`
- **6** — This represents the group, and the group can read and write the
  file: `4 (read) + 2 (write)`
- **4** — This represents others — others in this case can only read the
  file: `4 (read)`

## How to Modify Linux File Permissions

To modify file and directory permissions, we can use the `chmod` command.
`chmod` stands for "change mode."

`chmod` can be used in either symbolic mode or numeric mode. In symbolic
mode, we enter `chmod` followed by a class of user — `u`, `g`, or `o` (i.e.
user, group, others):

```bash
chmod o+r dockerfile
chmod ug+rw dockerfile
```

In numeric mode:

```bash
chmod 755 dockerfile
chmod 644 dockerfile
```

Note that in numeric mode we can also apply a permission recursively to an
entire directory, for example:

```bash
chmod -R 755 /var/www/html
```

## Conclusion

Linux permissions are a critical part of system security and file
management. By understanding the three core permissions — read, write, and
execute — and how they apply to users, groups, and others, we can
confidently control access to our files and directories. Whether we prefer
symbolic or numeric (octal) mode, the `chmod` command gives us the
flexibility to set permissions quickly and precisely. Getting comfortable
with permissions is an essential step toward becoming proficient in Linux.
