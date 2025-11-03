<?php
    /** @var $article ?\App\Model\Article */
?>

<div class="form-group">
    <label for="title">Title</label>
    <input type="text" id="title" name="article[title]" value="<?= $article ? $article->getTitle() : '' ?>">
</div>

<div class="form-group">
    <label for="author">Author</label>
    <input type="text" id="author" name="article[author]" value="<?= $article ? $article->getAuthor() : '' ?>">
</div>

<div class="form-group">
    <label for="content">Content</label>
    <textarea id="content" name="article[content]"><?= $article ? $article->getContent() : '' ?></textarea>
</div>

<div class="form-group">
    <label for="publication_date">Publication Date</label>
    <input type="datetime-local" id="publication_date" name="article[publication_date]" value="<?= $article && $article->getPublicationDate() ? date('Y-m-d\TH:i', strtotime($article->getPublicationDate())) : '' ?>">
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>