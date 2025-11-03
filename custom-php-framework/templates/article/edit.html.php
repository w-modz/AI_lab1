<?php

/** @var \App\Model\Article $article */
/** @var \App\Service\Router $router */

$title = "Edit Article {$article->getTitle()} ({$article->getId()})";
$bodyClass = "edit";

ob_start(); ?>
    <h1><?= $title ?></h1>
    <form action="<?= $router->generatePath('article-edit') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="article-edit">
        <input type="hidden" name="id" value="<?= $article->getId() ?>">
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('article-index') ?>">Back to list</a></li>
        <li>
            <form action="<?= $router->generatePath('article-delete') ?>" method="post">
                <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
                <input type="hidden" name="action" value="article-delete">
                <input type="hidden" name="id" value="<?= $article->getId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';