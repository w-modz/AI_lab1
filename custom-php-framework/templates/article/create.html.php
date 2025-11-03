<?php

/** @var \App\Model\Article $article */
/** @var \App\Service\Router $router */

$title = 'Create Article';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Create Article</h1>
    <form action="<?= $router->generatePath('article-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="article-create">
    </form>

    <a href="<?= $router->generatePath('article-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';